import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Modal, TextInput, TouchableOpacity,
  Alert, ActivityIndicator, Platform, useWindowDimensions,
} from 'react-native';
import { Plus, Search, Pencil, Trash2, X, User, ChevronDown } from 'lucide-react-native';
import { theme } from '../../../theme';
import { getToken } from '../../auth';
import * as S from './clientes.styles';

const API_URL = 'http://localhost:3000';

const TIPOS = ['Comprador', 'Vendedor', 'Comprador/Vendedor', 'Locatário', 'Proprietário'];

type Cliente = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  document: string | null;
  type: string | null;
  notes: string | null;
  created_at: string;
};

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  document: '',
  type: 'Comprador',
  notes: '',
};

/* ─── Máscaras ─────────────────────────────────────────────── */
function maskCpf(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function maskPhone(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function isValidCpf(cpf: string): boolean {
  const d = cpf.replace(/\D/g, '');
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
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

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR');
}

export default function Clientes() {
  const { width, height: winHeight } = useWindowDimensions();
  const isMobile = width < 800;

  const [list, setList] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('todos');
  const [showTypePicker, setShowTypePicker] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [errors, setErrors] = useState<Partial<typeof emptyForm>>({});
  const [saving, setSaving] = useState(false);
  const [showFormTipo, setShowFormTipo] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const searchTimer = useRef<any>(null);

  const modalMaxHeight = Platform.OS === 'web' ? winHeight * 0.88 : undefined;
  const formScrollHeight = Platform.OS === 'web' ? winHeight * 0.88 - 140 : undefined;

  useEffect(() => {
    fetchList('', 'todos');
  }, []);

  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => fetchList(search, filterType), 400);
    return () => clearTimeout(searchTimer.current);
  }, [search, filterType]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function fetchList(q: string, type: string) {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (q.trim()) params.set('search', q.trim());
      if (type !== 'todos') params.set('type', type);
      const qs = params.toString() ? `?${params}` : '';
      const res = await fetch(`${API_URL}/api/clientes${qs}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error();
      setList(await res.json());
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os clientes.');
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setErrors({});
    setShowFormTipo(false);
    setModalVisible(true);
  }

  function openEdit(c: Cliente) {
    setEditingId(c.id);
    setForm({
      name: c.name,
      email: c.email ?? '',
      phone: c.phone ?? '',
      document: c.document ?? '',
      type: c.type ?? 'Comprador',
      notes: c.notes ?? '',
    });
    setErrors({});
    setShowFormTipo(false);
    setModalVisible(true);
  }

  function validate() {
    const e: Partial<typeof emptyForm> = {};
    if (!form.name.trim()) e.name = 'Nome é obrigatório';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'E-mail inválido';
    if (form.document) {
      const digits = form.document.replace(/\D/g, '');
      if (digits && !isValidCpf(digits)) e.document = 'CPF inválido';
    }
    if (form.phone) {
      const digits = form.phone.replace(/\D/g, '');
      if (digits && digits.length < 10) e.phone = 'Telefone inválido';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      const body = {
        name: form.name.trim(),
        email: form.email.trim() || null,
        phone: form.phone || null,
        document: form.document.replace(/\D/g, '') || null,
        type: form.type || null,
        notes: form.notes.trim() || null,
      };
      const url = editingId
        ? `${API_URL}/api/clientes/${editingId}`
        : `${API_URL}/api/clientes`;
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        Alert.alert('Erro', data.error || 'Erro ao salvar cliente.');
        return;
      }
      setModalVisible(false);
      showToast(editingId ? 'Cliente atualizado com sucesso!' : 'Cliente cadastrado com sucesso!');
      fetchList(search, filterType);
    } catch {
      Alert.alert('Erro', 'Erro de conexão com o servidor.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(c: Cliente) {
    const confirmed =
      Platform.OS === 'web'
        ? (window as any).confirm(`Deseja excluir o cliente "${c.name}"?\n\nEsta ação não pode ser desfeita.`)
        : await new Promise<boolean>((resolve) => {
            Alert.alert(
              'Excluir cliente',
              `Deseja excluir "${c.name}"? Esta ação não pode ser desfeita.`,
              [
                { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
                { text: 'Excluir', style: 'destructive', onPress: () => resolve(true) },
              ]
            );
          });
    if (!confirmed) return;
    setDeletingId(c.id);
    try {
      const res = await fetch(`${API_URL}/api/clientes/${c.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error();
      showToast('Cliente excluído com sucesso!');
      fetchList(search, filterType);
    } catch {
      Alert.alert('Erro', 'Não foi possível excluir o cliente.');
    } finally {
      setDeletingId(null);
    }
  }

  function setField(key: keyof typeof emptyForm, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  const filterLabel = filterType === 'todos' ? 'Todos os tipos' : filterType;

  return (
    <S.Container>
      {/* Toast */}
      {toast && (
        <View style={{
          position: 'absolute', top: 16, right: 16, zIndex: 999,
          backgroundColor: '#166534', paddingHorizontal: 20, paddingVertical: 12,
          borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8,
        }}>
          <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>{toast}</Text>
        </View>
      )}

      {/* Header */}
      <S.HeaderRow>
        <S.TitleContainer>
          <S.Title>Clientes</S.Title>
          <S.Subtitle>Gerencie sua carteira de clientes</S.Subtitle>
        </S.TitleContainer>
        <S.AddButton onPress={openCreate}>
          <Plus size={20} color="white" />
          <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>Novo Cliente</Text>
        </S.AddButton>
      </S.HeaderRow>

      {/* Filtros */}
      <S.FilterSection>
        <S.SearchInput>
          <Search size={18} color={theme.colors.textLight} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar por nome, email ou CPF..."
            style={{ flex: 1, marginLeft: 10, outlineStyle: 'none', fontSize: 14 } as any}
          />
        </S.SearchInput>

        <View>
          <TouchableOpacity
            onPress={() => setShowTypePicker((v) => !v)}
            style={{
              width: Platform.OS === 'web' ? 200 : undefined,
              height: 45, backgroundColor: 'white',
              borderRadius: 8, borderWidth: 1, borderColor: theme.colors.border,
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
              paddingHorizontal: 12,
            }}
          >
            <Text style={{ color: theme.colors.text, fontSize: 14 }}>{filterLabel}</Text>
            <ChevronDown size={16} color={theme.colors.textLight} />
          </TouchableOpacity>
          {showTypePicker && (
            <S.DropdownMenu>
              {['todos', ...TIPOS].map((t) => (
                <S.DropdownItem key={t} onPress={() => { setFilterType(t); setShowTypePicker(false); }}>
                  <S.DropdownItemText>{t === 'todos' ? 'Todos os tipos' : t}</S.DropdownItemText>
                </S.DropdownItem>
              ))}
            </S.DropdownMenu>
          )}
        </View>
      </S.FilterSection>

      {/* Tabela */}
      {loading ? (
        <View style={{ padding: 48, alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 12, color: theme.colors.textLight }}>Carregando clientes...</Text>
        </View>
      ) : list.length === 0 ? (
        <View style={{ padding: 64, alignItems: 'center', gap: 8 }}>
          <User size={40} color={theme.colors.textLight} />
          <Text style={{ fontSize: 15, color: theme.colors.textLight }}>
            {search || filterType !== 'todos' ? 'Nenhum cliente encontrado.' : 'Nenhum cliente cadastrado ainda.'}
          </Text>
          {!search && filterType === 'todos' && (
            <TouchableOpacity onPress={openCreate} style={{ marginTop: 8, backgroundColor: '#0f172a', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}>
              <Text style={{ color: 'white', fontWeight: '600' }}>Cadastrar primeiro cliente</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <>
          <S.TableContainer style={{ minWidth: isMobile ? 900 : undefined }}>
            <S.TableHeader>
              <S.HeaderText style={{ flex: 3 }}>Cliente</S.HeaderText>
              <S.HeaderText style={{ flex: 2 }}>Contato</S.HeaderText>
              <S.HeaderText style={{ flex: 1.5 }}>CPF</S.HeaderText>
              <S.HeaderText style={{ flex: 1.5 }}>Tipo</S.HeaderText>
              <S.HeaderText style={{ flex: 1.2 }}>Cadastro</S.HeaderText>
              <S.HeaderText style={{ flex: 1, textAlign: 'right' }}>Ações</S.HeaderText>
            </S.TableHeader>

            {list.map((item) => (
              <S.TableRow key={item.id}>
                <View style={{ flex: 3 }}>
                  <S.ClientInfo>
                    <S.Avatar>
                      <User size={18} color={theme.colors.primary} />
                    </S.Avatar>
                    <View style={{ flex: 1 }}>
                      <S.ClientName>{item.name}</S.ClientName>
                      {item.notes ? (
                        <S.ClientObs numberOfLines={1}>{item.notes}</S.ClientObs>
                      ) : null}
                    </View>
                  </S.ClientInfo>
                </View>

                <View style={{ flex: 2 }}>
                  <S.ContactEmail numberOfLines={1}>{item.email ?? '—'}</S.ContactEmail>
                  <S.ContactPhone>{item.phone ?? '—'}</S.ContactPhone>
                </View>

                <Text style={{ flex: 1.5, fontSize: 13, color: theme.colors.text }}>
                  {item.document ? maskCpf(item.document) : '—'}
                </Text>

                <View style={{ flex: 1.5 }}>
                  {item.type ? (
                    <S.TypeBadge type={item.type}>
                      <S.TypeText type={item.type}>{item.type}</S.TypeText>
                    </S.TypeBadge>
                  ) : (
                    <Text style={{ fontSize: 13, color: theme.colors.textLight }}>—</Text>
                  )}
                </View>

                <Text style={{ flex: 1.2, fontSize: 13, color: theme.colors.textLight }}>
                  {formatDate(item.created_at)}
                </Text>

                <S.ActionButtons style={{ flex: 1, justifyContent: 'flex-end' }}>
                  <S.IconButton onPress={() => openEdit(item)}>
                    <Pencil size={15} color={theme.colors.text} />
                  </S.IconButton>
                  <S.IconButton variant="danger" onPress={() => handleDelete(item)} disabled={deletingId === item.id}>
                    {deletingId === item.id
                      ? <ActivityIndicator size="small" color={theme.colors.danger} />
                      : <Trash2 size={15} color={theme.colors.danger} />}
                  </S.IconButton>
                </S.ActionButtons>
              </S.TableRow>
            ))}
          </S.TableContainer>
          <S.FooterText>Total: {list.length} cliente(s)</S.FooterText>
        </>
      )}

      {/* Modal Criar / Editar */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <S.ModalOverlay>
          <S.ModalContainer style={modalMaxHeight ? { maxHeight: modalMaxHeight } : undefined}>
            {/* Header */}
            <S.ModalHeader>
              <S.ModalTitle>{editingId ? 'Editar Cliente' : 'Novo Cliente'}</S.ModalTitle>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={22} color={theme.colors.textLight} />
              </TouchableOpacity>
            </S.ModalHeader>

            {/* Formulário */}
            <S.FormScroll
              keyboardShouldPersistTaps="handled"
              style={formScrollHeight ? { maxHeight: formScrollHeight } : undefined}
            >
              <S.FormBody>

                {/* Nome */}
                <S.InputGroup>
                  <S.Label>Nome completo *</S.Label>
                  <S.StyledInput
                    value={form.name}
                    onChangeText={(v) => setField('name', v)}
                    placeholder="Ex: João da Silva"
                    error={!!errors.name}
                  />
                  {errors.name && <S.ErrorText>{errors.name}</S.ErrorText>}
                </S.InputGroup>

                {/* Email */}
                <S.InputGroup>
                  <S.Label>E-mail</S.Label>
                  <S.StyledInput
                    value={form.email}
                    onChangeText={(v) => setField('email', v)}
                    placeholder="cliente@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={!!errors.email}
                  />
                  {errors.email && <S.ErrorText>{errors.email}</S.ErrorText>}
                </S.InputGroup>

                {/* Telefone + CPF */}
                <S.Row>
                  <S.FlexField>
                    <S.Label>Telefone</S.Label>
                    <S.StyledInput
                      value={form.phone}
                      onChangeText={(v) => setField('phone', maskPhone(v))}
                      placeholder="(11) 99999-9999"
                      keyboardType="phone-pad"
                      error={!!errors.phone}
                    />
                    {errors.phone && <S.ErrorText>{errors.phone}</S.ErrorText>}
                  </S.FlexField>
                  <S.FlexField>
                    <S.Label>CPF</S.Label>
                    <S.StyledInput
                      value={form.document}
                      onChangeText={(v) => setField('document', maskCpf(v))}
                      placeholder="000.000.000-00"
                      keyboardType="numeric"
                      error={!!errors.document}
                    />
                    {errors.document && <S.ErrorText>{errors.document}</S.ErrorText>}
                  </S.FlexField>
                </S.Row>

                {/* Tipo */}
                <S.InputGroup>
                  <S.Label>Tipo de cliente</S.Label>
                  <S.SelectWrapper onPress={() => setShowFormTipo((v) => !v)}>
                    <S.SelectText>{form.type || 'Selecione...'}</S.SelectText>
                    <ChevronDown size={16} color={theme.colors.textLight} />
                  </S.SelectWrapper>
                  {showFormTipo && (
                    <S.DropdownMenu>
                      {TIPOS.map((t) => (
                        <S.DropdownItem key={t} onPress={() => { setField('type', t); setShowFormTipo(false); }}>
                          <S.DropdownItemText>{t}</S.DropdownItemText>
                        </S.DropdownItem>
                      ))}
                    </S.DropdownMenu>
                  )}
                </S.InputGroup>

                {/* Observações */}
                <S.InputGroup>
                  <S.Label>Observações</S.Label>
                  <S.StyledTextArea
                    value={form.notes}
                    onChangeText={(v) => setField('notes', v)}
                    placeholder="Informações adicionais sobre o cliente..."
                    multiline
                    numberOfLines={3}
                  />
                </S.InputGroup>

              </S.FormBody>
            </S.FormScroll>

            {/* Footer */}
            <S.ModalFooter>
              <S.CancelButton onPress={() => setModalVisible(false)}>
                <Text style={{ fontSize: 14, color: theme.colors.text }}>Cancelar</Text>
              </S.CancelButton>
              <S.SaveButton onPress={handleSave} disabled={saving}>
                {saving
                  ? <ActivityIndicator size="small" color="white" />
                  : <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>
                      {editingId ? 'Salvar alterações' : 'Cadastrar cliente'}
                    </Text>}
              </S.SaveButton>
            </S.ModalFooter>

          </S.ModalContainer>
        </S.ModalOverlay>
      </Modal>
    </S.Container>
  );
}
