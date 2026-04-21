import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Modal, TouchableOpacity, Alert,
  ActivityIndicator, useWindowDimensions,
} from 'react-native';
import { Plus, Search, Pencil, Trash2, X, ShieldAlert, ChevronDown } from 'lucide-react-native';
import { theme } from '../../../theme';
import { getToken, getUser } from '../../auth';
import * as S from './funcionarios.styles';

const API_URL = 'http://localhost:3000';

const ROLES = ['corretor', 'admin', 'gerente', 'assistente'];

type Funcionario = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  cpf: string | null;
  created_at: string;
};

const emptyForm = {
  full_name: '',
  email: '',
  password: '',
  role: 'corretor',
  cpf: '',
};

function formatCpf(cpf: string | null) {
  if (!cpf) return '—';
  const d = cpf.replace(/\D/g, '');
  if (d.length !== 11) return cpf;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function maskCpf(value: string) {
  const d = value.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function isValidCpf(cpf: string): boolean {
  const d = cpf.replace(/\D/g, '');
  if (d.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(d)) return false; // todos iguais: 111.111.111-11
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(d[i]) * (10 - i);
  let r = (sum * 10) % 11;
  if (r === 10 || r === 11) r = 0;
  if (r !== parseInt(d[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(d[i]) * (11 - i);
  r = (sum * 10) % 11;
  if (r === 10 || r === 11) r = 0;
  return r === parseInt(d[10]);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function Funcionarios() {
  const { width } = useWindowDimensions();
  const isWide = width >= 900;
  const user = getUser();
  const isAdmin = user?.role === 'admin';

  const [list, setList] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [errors, setErrors] = useState<Partial<typeof emptyForm>>({});
  const [saving, setSaving] = useState(false);
  const [showRolePicker, setShowRolePicker] = useState(false);
  const searchTimer = useRef<any>(null);

  useEffect(() => {
    if (isAdmin) fetchList('');
    else setLoading(false);
  }, []);

  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => fetchList(search), 400);
    return () => clearTimeout(searchTimer.current);
  }, [search]);

  async function fetchList(q: string) {
    try {
      setLoading(true);
      const params = q.trim() ? `?search=${encodeURIComponent(q)}` : '';
      const res = await fetch(`${API_URL}/api/funcionarios${params}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error();
      setList(await res.json());
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os funcionários.');
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setErrors({});
    setShowRolePicker(false);
    setModalVisible(true);
  }

  function openEdit(f: Funcionario) {
    setEditingId(f.id);
    setForm({
      full_name: f.full_name ?? '',
      email: f.email ?? '',
      password: '',
      role: f.role ?? 'corretor',
      cpf: f.cpf ?? '',
    });
    setErrors({});
    setShowRolePicker(false);
    setModalVisible(true);
  }

  function validate() {
    const e: Partial<typeof emptyForm> = {};

    if (!form.full_name.trim()) {
      e.full_name = 'Nome é obrigatório';
    } else if (form.full_name.trim().length < 3) {
      e.full_name = 'Nome deve ter ao menos 3 caracteres';
    } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(form.full_name.trim())) {
      e.full_name = 'Nome deve conter apenas letras';
    }

    if (!form.email.trim()) {
      e.email = 'E-mail é obrigatório';
    } else if (!isValidEmail(form.email)) {
      e.email = 'E-mail inválido';
    }

    if (!editingId) {
      if (!form.password.trim()) {
        e.password = 'Senha é obrigatória';
      } else if (form.password.length < 6) {
        e.password = 'Senha deve ter ao menos 6 caracteres';
      }
    }

    if (!form.cpf.trim()) {
      e.cpf = 'CPF é obrigatório';
    } else if (!isValidCpf(form.cpf)) {
      e.cpf = 'CPF inválido';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      const body: any = {
        full_name: form.full_name,
        email: form.email,
        role: form.role,
        cpf: form.cpf.replace(/\D/g, ''),
      };
      if (!editingId) body.password = form.password;

      const url = editingId
        ? `${API_URL}/api/funcionarios/${editingId}`
        : `${API_URL}/api/funcionarios`;
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        Alert.alert('Erro', data.error || 'Erro ao salvar');
        return;
      }
      setModalVisible(false);
      fetchList(search);
    } catch {
      Alert.alert('Erro', 'Falha na requisição');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(f: Funcionario) {
    Alert.alert(
      'Excluir funcionário',
      `Deseja excluir "${f.full_name}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir', style: 'destructive',
          onPress: async () => {
            try {
              const res = await fetch(`${API_URL}/api/funcionarios/${f.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` },
              });
              if (res.status === 400) {
                const d = await res.json();
                Alert.alert('Erro', d.error);
                return;
              }
              fetchList(search);
            } catch {
              Alert.alert('Erro', 'Não foi possível excluir');
            }
          },
        },
      ]
    );
  }

  if (!isAdmin) {
    return (
      <S.AccessDenied>
        <ShieldAlert size={48} color="#ef4444" />
        <S.AccessDeniedText>Acesso restrito</S.AccessDeniedText>
        <S.AccessDeniedSub>Esta área é exclusiva para administradores.</S.AccessDeniedSub>
      </S.AccessDenied>
    );
  }

  return (
    <S.Container>
      {/* Cabeçalho */}
      <S.HeaderRow>
        <S.TitleContainer>
          <S.Title>Funcionários</S.Title>
          <S.Subtitle>{list.length} {list.length === 1 ? 'funcionário' : 'funcionários'} cadastrados</S.Subtitle>
        </S.TitleContainer>
        <S.AddButton onPress={openCreate}>
          <Plus size={18} color="white" />
          <S.AddButtonText>Novo Funcionário</S.AddButtonText>
        </S.AddButton>
      </S.HeaderRow>

      {/* Busca */}
      <S.SearchRow>
        <S.SearchBox>
          <Search size={16} color={theme.colors.textLight} />
          <S.SearchInput
            placeholder="Buscar por nome, e-mail ou CPF..."
            placeholderTextColor={theme.colors.textLight}
            value={search}
            onChangeText={setSearch}
          />
        </S.SearchBox>
      </S.SearchRow>

      {/* Tabela */}
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 48 }} />
      ) : list.length === 0 ? (
        <S.EmptyState>
          <S.EmptyText>Nenhum funcionário encontrado.</S.EmptyText>
        </S.EmptyState>
      ) : (
        <View>
          {isWide && (
            <S.TableHeader>
              <S.TableHeaderCell flex={2}>Nome</S.TableHeaderCell>
              <S.TableHeaderCell flex={2}>E-mail</S.TableHeaderCell>
              <S.TableHeaderCell flex={1}>CPF</S.TableHeaderCell>
              <S.TableHeaderCell flex={1}>Cargo</S.TableHeaderCell>
              <S.TableHeaderCell flex={1}>{' '}</S.TableHeaderCell>
            </S.TableHeader>
          )}
          {list.map((f) => (
            <S.TableRow key={f.id}>
              {isWide ? (
                <>
                  <S.Cell flex={2}>{f.full_name ?? '—'}</S.Cell>
                  <S.Cell flex={2} muted>{f.email ?? '—'}</S.Cell>
                  <S.Cell flex={1} muted>{formatCpf(f.cpf)}</S.Cell>
                  <S.Cell flex={1}>
                    <S.RoleBadge role={f.role ?? ''}>
                      <S.RoleBadgeText role={f.role ?? ''}>{f.role ?? '—'}</S.RoleBadgeText>
                    </S.RoleBadge>
                  </S.Cell>
                  <S.ActionsCell style={{ flex: 1 }}>
                    <S.IconButton onPress={() => openEdit(f)}>
                      <Pencil size={16} color={theme.colors.textLight} />
                    </S.IconButton>
                    <S.IconButton danger onPress={() => handleDelete(f)}>
                      <Trash2 size={16} color="#ef4444" />
                    </S.IconButton>
                  </S.ActionsCell>
                </>
              ) : (
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '600', color: theme.colors.text, marginBottom: 2 }}>
                    {f.full_name}
                  </Text>
                  <Text style={{ fontSize: 13, color: theme.colors.textLight }}>{f.email}</Text>
                  <Text style={{ fontSize: 13, color: theme.colors.textLight }}>{formatCpf(f.cpf)}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                    <S.RoleBadge role={f.role ?? ''}>
                      <S.RoleBadgeText role={f.role ?? ''}>{f.role ?? '—'}</S.RoleBadgeText>
                    </S.RoleBadge>
                    <S.ActionsCell>
                      <S.IconButton onPress={() => openEdit(f)}>
                        <Pencil size={16} color={theme.colors.textLight} />
                      </S.IconButton>
                      <S.IconButton danger onPress={() => handleDelete(f)}>
                        <Trash2 size={16} color="#ef4444" />
                      </S.IconButton>
                    </S.ActionsCell>
                  </View>
                </View>
              )}
            </S.TableRow>
          ))}
        </View>
      )}

      {/* Modal criar / editar */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <S.ModalOverlay>
          <S.ModalBox>
            <S.ModalHeader>
              <S.ModalTitle>{editingId ? 'Editar Funcionário' : 'Novo Funcionário'}</S.ModalTitle>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={22} color={theme.colors.textLight} />
              </TouchableOpacity>
            </S.ModalHeader>

            <S.ModalBody>
              {/* Nome */}
              <S.FieldGroup>
                <S.Label>Nome completo *</S.Label>
                <S.Input
                  placeholder="Ex: João Silva"
                  placeholderTextColor={theme.colors.textLight}
                  value={form.full_name}
                  onChangeText={(v) => setForm({ ...form, full_name: v })}
                  error={!!errors.full_name}
                />
                {errors.full_name && <S.ErrorText>{errors.full_name}</S.ErrorText>}
              </S.FieldGroup>

              {/* E-mail */}
              <S.FieldGroup>
                <S.Label>E-mail *</S.Label>
                <S.Input
                  placeholder="joao@empresa.com"
                  placeholderTextColor={theme.colors.textLight}
                  value={form.email}
                  onChangeText={(v) => setForm({ ...form, email: v })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={!!errors.email}
                />
                {errors.email && <S.ErrorText>{errors.email}</S.ErrorText>}
              </S.FieldGroup>

              {/* Senha - só na criação */}
              {!editingId && (
                <S.FieldGroup>
                  <S.Label>Senha *</S.Label>
                  <S.Input
                    placeholder="Senha de acesso"
                    placeholderTextColor={theme.colors.textLight}
                    value={form.password}
                    onChangeText={(v) => setForm({ ...form, password: v })}
                    secureTextEntry
                    error={!!errors.password}
                  />
                  {errors.password && <S.ErrorText>{errors.password}</S.ErrorText>}
                </S.FieldGroup>
              )}

              {/* CPF */}
              <S.FieldGroup>
                <S.Label>CPF *</S.Label>
                <S.Input
                  placeholder="000.000.000-00"
                  placeholderTextColor={theme.colors.textLight}
                  value={form.cpf}
                  onChangeText={(v) => setForm({ ...form, cpf: maskCpf(v) })}
                  keyboardType="numeric"
                  maxLength={14}
                  error={!!errors.cpf}
                />
                {errors.cpf && <S.ErrorText>{errors.cpf}</S.ErrorText>}
              </S.FieldGroup>

              {/* Cargo */}
              <S.FieldGroup>
                <S.Label>Cargo *</S.Label>
                <S.SelectBox onPress={() => setShowRolePicker(!showRolePicker)}>
                  <S.SelectText>{form.role}</S.SelectText>
                  <ChevronDown size={16} color={theme.colors.textLight} />
                </S.SelectBox>
                {showRolePicker && (
                  <S.DropdownMenu>
                    {ROLES.map((r) => (
                      <S.DropdownItem
                        key={r}
                        onPress={() => { setForm({ ...form, role: r }); setShowRolePicker(false); }}
                      >
                        <S.DropdownItemText>{r}</S.DropdownItemText>
                      </S.DropdownItem>
                    ))}
                  </S.DropdownMenu>
                )}
              </S.FieldGroup>
            </S.ModalBody>

            <S.ModalFooter>
              <S.CancelButton onPress={() => setModalVisible(false)}>
                <S.CancelButtonText>Cancelar</S.CancelButtonText>
              </S.CancelButton>
              <S.SaveButton onPress={handleSave} loading={saving} disabled={saving}>
                {saving
                  ? <ActivityIndicator size="small" color="white" />
                  : <S.SaveButtonText>{editingId ? 'Salvar alterações' : 'Cadastrar'}</S.SaveButtonText>
                }
              </S.SaveButton>
            </S.ModalFooter>
          </S.ModalBox>
        </S.ModalOverlay>
      </Modal>
    </S.Container>
  );
}
