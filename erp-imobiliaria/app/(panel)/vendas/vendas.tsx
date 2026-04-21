import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Alert, Modal, Platform, Text,
  TextInput, TouchableOpacity, View,
} from 'react-native';
import {
  CheckCircle2, ChevronDown, Clock, DollarSign,
  Edit2, Plus, Search, Trash2, XCircle,
} from 'lucide-react-native';
import { theme } from '../../../theme';
import { getToken } from '../../auth';
import * as S from './vendas.styles';

const API = 'http://localhost:3000';

const STATUS_OPTIONS = ['Em Negociação', 'Concluída', 'Cancelada'];

/* ─── tipos ──────────────────────────────────────────────────────────────── */
interface Venda {
  id: string;
  property_id: string | null;
  client_id: string | null;
  broker_id: string | null;
  total_value: number;
  commission_percentage: number | null;
  commission_value: number | null;
  status: string;
  sale_date: string | null;
  property?: { id: string; title: string; city: string | null; state: string | null };
  client?: { id: string; name: string };
  broker?: { id: string; full_name: string | null };
}

interface Stats {
  total: number;
  concluidas: number;
  valorTotal: number;
  comissaoTotal: number;
}

interface SelectOption { id: string; label: string; sub?: string }

const EMPTY_FORM = {
  property_id: '',
  client_id: '',
  broker_id: '',
  total_value: '',
  commission_percentage: '',
  commission_value: '',
  status: 'Em Negociação',
  sale_date: new Date().toISOString().split('T')[0],
};

/* ─── utilitários ──────────────────────────────────────────────────────── */
function fmt(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function fmtDate(iso: string | null) {
  if (!iso) return '—';
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function maskMoney(raw: string) {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  const num = parseInt(digits, 10) / 100;
  return num.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

function parseMoney(str: string) {
  return parseFloat(str.replace(/\./g, '').replace(',', '.')) || 0;
}

/* ─── componente principal ──────────────────────────────────────────────── */
export default function Vendas() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, concluidas: 0, valorTotal: 0, comissaoTotal: 0 });
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Venda | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  /* listas para os selects do modal */
  const [imoveis, setImoveis] = useState<SelectOption[]>([]);
  const [clientes, setClientes] = useState<SelectOption[]>([]);
  const [corretores, setCorretores] = useState<SelectOption[]>([]);

  /* dropdowns abertos no modal */
  const [openDrop, setOpenDrop] = useState<'imovel' | 'cliente' | 'corretor' | 'status' | null>(null);

  const searchTimer = useRef<any>(null);

  /* ─── fetch ─────────────────────────────────────────────────────────── */
  const fetchVendas = useCallback(async (q = search, s = filterStatus) => {
    try {
      const token = await getToken();
      const params = new URLSearchParams();
      if (q) params.set('search', q);
      if (s !== 'todos') params.set('status', s);
      const res = await fetch(`${API}/api/vendas?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setVendas(await res.json());
    } catch {}
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${API}/api/vendas/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setStats(await res.json());
    } catch {}
  }, []);

  const fetchLists = useCallback(async () => {
    const token = await getToken();
    const headers = { Authorization: `Bearer ${token}` };
    const [ri, rc, rb] = await Promise.all([
      fetch(`${API}/api/imoveis`, { headers }),
      fetch(`${API}/api/clientes`, { headers }),
      fetch(`${API}/api/funcionarios`, { headers }).catch(() => ({ ok: false } as Response)),
    ]);
    if (ri.ok) {
      const data = await ri.json();
      setImoveis(data.map((i: any) => ({ id: i.id, label: i.title, sub: [i.city, i.state].filter(Boolean).join(' - ') })));
    }
    if (rc.ok) {
      const data = await rc.json();
      setClientes(data.map((c: any) => ({ id: c.id, label: c.name })));
    }
    if (rb.ok) {
      const data = await rb.json();
      setCorretores(data.map((b: any) => ({ id: b.id, label: b.full_name || b.email })));
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchVendas(), fetchStats()]);
      setLoading(false);
    })();
  }, []);

  /* debounce search */
  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => fetchVendas(search, filterStatus), 350);
    return () => clearTimeout(searchTimer.current);
  }, [search, filterStatus]);

  /* ─── modal ─────────────────────────────────────────────────────────── */
  function openModal(venda?: Venda) {
    fetchLists();
    setEditing(venda || null);
    setErrors({});
    setOpenDrop(null);
    if (venda) {
      setForm({
        property_id: venda.property_id || '',
        client_id: venda.client_id || '',
        broker_id: venda.broker_id || '',
        total_value: parseMoney('') === 0
          ? venda.total_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
          : String(venda.total_value),
        commission_percentage: venda.commission_percentage ? String(venda.commission_percentage) : '',
        commission_value: venda.commission_value
          ? venda.commission_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
          : '',
        status: venda.status || 'Em Negociação',
        sale_date: venda.sale_date ? venda.sale_date.split('T')[0] : new Date().toISOString().split('T')[0],
      });
    } else {
      setForm({ ...EMPTY_FORM });
    }
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
    setEditing(null);
  }

  function setField(key: string, value: string) {
    setForm(prev => {
      const next = { ...prev, [key]: value };
      /* recalcula comissão automaticamente */
      if (key === 'commission_percentage' || key === 'total_value') {
        const total = parseMoney(key === 'total_value' ? value : next.total_value);
        const pct = parseFloat(key === 'commission_percentage' ? value : next.commission_percentage);
        if (total > 0 && pct > 0) {
          const calc = (total * pct) / 100;
          next.commission_value = calc.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        }
      }
      return next;
    });
    if (errors[key]) setErrors(prev => { const e = { ...prev }; delete e[key]; return e; });
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.total_value) e.total_value = 'Valor obrigatório';
    return e;
  }

  async function handleSave() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      const token = await getToken();
      const body = {
        property_id: form.property_id || null,
        client_id: form.client_id || null,
        broker_id: form.broker_id || null,
        total_value: parseMoney(form.total_value),
        commission_percentage: form.commission_percentage ? parseFloat(form.commission_percentage) : null,
        commission_value: form.commission_value ? parseMoney(form.commission_value) : null,
        status: form.status,
        sale_date: form.sale_date || null,
      };
      const url = editing ? `${API}/api/vendas/${editing.id}` : `${API}/api/vendas`;
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        setToast(data.error || 'Erro ao salvar');
        return;
      }
      closeModal();
      await Promise.all([fetchVendas(), fetchStats()]);
      showToast(editing ? 'Venda atualizada!' : 'Venda registrada!');
    } catch {
      setToast('Erro de conexão');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(venda: Venda) {
    const label = venda.property?.title || 'esta venda';
    const confirmed = Platform.OS === 'web'
      ? (window as any).confirm(`Deseja excluir "${label}"?`)
      : await new Promise<boolean>(resolve =>
          Alert.alert('Excluir venda', `Deseja excluir "${label}"?`, [
            { text: 'Cancelar', onPress: () => resolve(false), style: 'cancel' },
            { text: 'Excluir', onPress: () => resolve(true), style: 'destructive' },
          ])
        );
    if (!confirmed) return;
    try {
      const token = await getToken();
      const res = await fetch(`${API}/api/vendas/${venda.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        await Promise.all([fetchVendas(), fetchStats()]);
        showToast('Venda excluída');
      }
    } catch {}
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  function statusColor(s: string) {
    if (s === 'Concluída') return { bg: '#dcfce7', text: '#166534' };
    if (s === 'Cancelada') return { bg: '#fee2e2', text: '#991b1b' };
    return { bg: '#dbeafe', text: '#1e40af' };
  }

  function statusIcon(s: string) {
    if (s === 'Concluída') return <CheckCircle2 size={12} color="#166534" />;
    if (s === 'Cancelada') return <XCircle size={12} color="#991b1b" />;
    return <Clock size={12} color="#1e40af" />;
  }

  /* ─── render ─────────────────────────────────────────────────────────── */
  return (
    <S.Container>

      {/* Toast */}
      {!!toast && (
        <View style={{
          position: 'absolute', top: 16, right: 16, zIndex: 9999,
          backgroundColor: '#1e293b', paddingHorizontal: 18, paddingVertical: 12,
          borderRadius: 10,
        }}>
          <Text style={{ color: 'white', fontSize: 14 }}>{toast}</Text>
        </View>
      )}

      {/* Header */}
      <S.HeaderRow>
        <View>
          <S.Title>Vendas</S.Title>
          <S.Subtitle>Gerencie as vendas realizadas</S.Subtitle>
        </View>
        <S.AddButton onPress={() => openModal()}>
          <Plus size={18} color="white" />
          <S.AddButtonText>Registrar Venda</S.AddButtonText>
        </S.AddButton>
      </S.HeaderRow>

      {/* Stats */}
      <S.StatsRow>
        <SummaryCard label="Total de Vendas" value={String(stats.total)} icon={<DollarSign size={20} color={theme.colors.success} />} />
        <SummaryCard label="Concluídas" value={String(stats.concluidas)} icon={<CheckCircle2 size={20} color={theme.colors.primary} />} />
        <SummaryCard label="Valor Total" value={fmt(Number(stats.valorTotal))} icon={<DollarSign size={20} color={theme.colors.primary} />} />
        <SummaryCard label="Total Comissões" value={fmt(Number(stats.comissaoTotal))} icon={<DollarSign size={20} color="#a855f7" />} />
      </S.StatsRow>

      {/* Filtros */}
      <S.FilterSection>
        <S.SearchInputBox>
          <Search size={18} color={theme.colors.textLight} />
          <TextInput
            placeholder="Buscar por imóvel, cliente ou corretor..."
            value={search}
            onChangeText={setSearch}
            style={{ flex: 1, marginLeft: 10, fontSize: 14, color: theme.colors.text, outlineStyle: 'none' } as any}
          />
        </S.SearchInputBox>

        <View style={{ position: 'relative', width: Platform.OS === 'web' ? 200 : '100%' }}>
          <S.FilterDropdownBtn onPress={() => setShowStatusFilter(p => !p)}>
            <Text style={{ fontSize: 14, color: filterStatus === 'todos' ? theme.colors.textLight : theme.colors.text }}>
              {filterStatus === 'todos' ? 'Todos os status' : filterStatus}
            </Text>
            <ChevronDown size={16} color={theme.colors.textLight} />
          </S.FilterDropdownBtn>
          {showStatusFilter && (
            <View style={{ position: 'absolute', top: 48, left: 0, right: 0, backgroundColor: 'white', borderWidth: 1, borderColor: theme.colors.border, borderRadius: 8, zIndex: 999, overflow: 'hidden' }}>
              {['todos', ...STATUS_OPTIONS].map(s => (
                <TouchableOpacity
                  key={s}
                  onPress={() => { setFilterStatus(s); setShowStatusFilter(false); }}
                  style={{ padding: 11, borderBottomWidth: 1, borderBottomColor: theme.colors.border, backgroundColor: filterStatus === s ? '#f1f5f9' : 'white' }}
                >
                  <Text style={{ fontSize: 14, color: theme.colors.text }}>{s === 'todos' ? 'Todos os status' : s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </S.FilterSection>

      {/* Tabela */}
      {loading ? (
        <View style={{ padding: 64, alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : vendas.length === 0 ? (
        <S.EmptyState>
          <DollarSign size={40} color={theme.colors.textLight} />
          <S.EmptyText>Nenhuma venda encontrada</S.EmptyText>
        </S.EmptyState>
      ) : (
        <S.TableScrollH horizontal showsHorizontalScrollIndicator={false}>
          <S.TableContainer style={{ minWidth: 1050 }}>
            <S.TableHeader>
              <S.HeaderText style={{ flex: 2.2 }}>Imóvel</S.HeaderText>
              <S.HeaderText style={{ flex: 1.4 }}>Cliente</S.HeaderText>
              <S.HeaderText style={{ flex: 1.4 }}>Corretor</S.HeaderText>
              <S.HeaderText style={{ flex: 1.3 }}>Valor</S.HeaderText>
              <S.HeaderText style={{ flex: 1.3 }}>Comissão</S.HeaderText>
              <S.HeaderText style={{ flex: 1.2 }}>Status</S.HeaderText>
              <S.HeaderText style={{ flex: 0.9 }}>Data</S.HeaderText>
              <S.HeaderText style={{ flex: 0.7, textAlign: 'right' }}>Ações</S.HeaderText>
            </S.TableHeader>

            {vendas.map(v => {
              const sc = statusColor(v.status);
              return (
                <S.TableRow key={v.id}>
                  <S.PropertyInfo style={{ flex: 2.2 }}>
                    <S.PropertyName numberOfLines={1}>{v.property?.title || '—'}</S.PropertyName>
                    <S.PropertyLocation>{[v.property?.city, v.property?.state].filter(Boolean).join(' - ') || ''}</S.PropertyLocation>
                  </S.PropertyInfo>

                  <View style={{ flex: 1.4 }}>
                    <S.TextCell numberOfLines={1}>{v.client?.name || '—'}</S.TextCell>
                  </View>

                  <View style={{ flex: 1.4 }}>
                    <S.TextCell numberOfLines={1}>{v.broker?.full_name || '—'}</S.TextCell>
                  </View>

                  <View style={{ flex: 1.3 }}>
                    <S.TextCell style={{ fontWeight: '700' }}>{fmt(Number(v.total_value))}</S.TextCell>
                  </View>

                  <View style={{ flex: 1.3 }}>
                    <S.CommissionValue>{v.commission_value ? fmt(Number(v.commission_value)) : '—'}</S.CommissionValue>
                    {v.commission_percentage && (
                      <S.CommissionPercent>{Number(v.commission_percentage).toFixed(1)}%</S.CommissionPercent>
                    )}
                  </View>

                  <View style={{ flex: 1.2 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: sc.bg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start' }}>
                      {statusIcon(v.status)}
                      <Text style={{ fontSize: 11, fontWeight: '700', color: sc.text }}>{v.status}</Text>
                    </View>
                  </View>

                  <View style={{ flex: 0.9 }}>
                    <S.TextCell style={{ color: theme.colors.textLight }}>{fmtDate(v.sale_date)}</S.TextCell>
                  </View>

                  <View style={{ flex: 0.7, flexDirection: 'row', justifyContent: 'flex-end', gap: 6 }}>
                    <S.IconBtn onPress={() => openModal(v)}>
                      <Edit2 size={14} color={theme.colors.text} />
                    </S.IconBtn>
                    <S.IconBtn variant="danger" onPress={() => handleDelete(v)}>
                      <Trash2 size={14} color="#ef4444" />
                    </S.IconBtn>
                  </View>
                </S.TableRow>
              );
            })}
          </S.TableContainer>
        </S.TableScrollH>
      )}

      <S.FooterText>{vendas.length} venda{vendas.length !== 1 ? 's' : ''} encontrada{vendas.length !== 1 ? 's' : ''}</S.FooterText>

      {/* ─── Modal ─────────────────────────────────────────────────────── */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={closeModal}>
        <S.ModalOverlay>
          <S.ModalBox keyboardShouldPersistTaps="handled">

            <S.ModalHeader>
              <S.ModalTitle>{editing ? 'Editar Venda' : 'Registrar Venda'}</S.ModalTitle>
              <TouchableOpacity onPress={closeModal}>
                <Text style={{ fontSize: 22, color: theme.colors.textLight }}>✕</Text>
              </TouchableOpacity>
            </S.ModalHeader>

            <S.FormBody>

              {/* Imóvel */}
              <S.InputGroup>
                <S.Label>Imóvel</S.Label>
                <View style={{ zIndex: openDrop === 'imovel' ? 100 : 1 }}>
                  <S.SelectWrapper onPress={() => setOpenDrop(p => p === 'imovel' ? null : 'imovel')}>
                    <S.SelectText numberOfLines={1}>
                      {imoveis.find(i => i.id === form.property_id)?.label || 'Selecionar imóvel...'}
                    </S.SelectText>
                    <ChevronDown size={16} color={theme.colors.textLight} />
                  </S.SelectWrapper>
                  {openDrop === 'imovel' && (
                    <View style={{ position: 'absolute', top: 46, left: 0, right: 0, backgroundColor: 'white', borderWidth: 1, borderColor: theme.colors.border, borderRadius: 8, zIndex: 999, maxHeight: 200, overflow: 'hidden' }}>
                      <TouchableOpacity onPress={() => { setField('property_id', ''); setOpenDrop(null); }} style={{ padding: 11, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
                        <Text style={{ fontSize: 14, color: theme.colors.textLight }}>— Nenhum —</Text>
                      </TouchableOpacity>
                      {imoveis.map(i => (
                        <TouchableOpacity key={i.id} onPress={() => { setField('property_id', i.id); setOpenDrop(null); }} style={{ padding: 11, borderBottomWidth: 1, borderBottomColor: theme.colors.border, backgroundColor: form.property_id === i.id ? '#f1f5f9' : 'white' }}>
                          <Text style={{ fontSize: 14, color: theme.colors.text }}>{i.label}</Text>
                          {i.sub ? <Text style={{ fontSize: 11, color: theme.colors.textLight }}>{i.sub}</Text> : null}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </S.InputGroup>

              {/* Cliente */}
              <S.InputGroup>
                <S.Label>Cliente</S.Label>
                <View style={{ zIndex: openDrop === 'cliente' ? 100 : 1 }}>
                  <S.SelectWrapper onPress={() => setOpenDrop(p => p === 'cliente' ? null : 'cliente')}>
                    <S.SelectText numberOfLines={1}>
                      {clientes.find(c => c.id === form.client_id)?.label || 'Selecionar cliente...'}
                    </S.SelectText>
                    <ChevronDown size={16} color={theme.colors.textLight} />
                  </S.SelectWrapper>
                  {openDrop === 'cliente' && (
                    <View style={{ position: 'absolute', top: 46, left: 0, right: 0, backgroundColor: 'white', borderWidth: 1, borderColor: theme.colors.border, borderRadius: 8, zIndex: 999, maxHeight: 200, overflow: 'hidden' }}>
                      <TouchableOpacity onPress={() => { setField('client_id', ''); setOpenDrop(null); }} style={{ padding: 11, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
                        <Text style={{ fontSize: 14, color: theme.colors.textLight }}>— Nenhum —</Text>
                      </TouchableOpacity>
                      {clientes.map(c => (
                        <TouchableOpacity key={c.id} onPress={() => { setField('client_id', c.id); setOpenDrop(null); }} style={{ padding: 11, borderBottomWidth: 1, borderBottomColor: theme.colors.border, backgroundColor: form.client_id === c.id ? '#f1f5f9' : 'white' }}>
                          <Text style={{ fontSize: 14, color: theme.colors.text }}>{c.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </S.InputGroup>

              {/* Corretor */}
              <S.InputGroup>
                <S.Label>Corretor</S.Label>
                <View style={{ zIndex: openDrop === 'corretor' ? 100 : 1 }}>
                  <S.SelectWrapper onPress={() => setOpenDrop(p => p === 'corretor' ? null : 'corretor')}>
                    <S.SelectText numberOfLines={1}>
                      {corretores.find(b => b.id === form.broker_id)?.label || 'Selecionar corretor...'}
                    </S.SelectText>
                    <ChevronDown size={16} color={theme.colors.textLight} />
                  </S.SelectWrapper>
                  {openDrop === 'corretor' && (
                    <View style={{ position: 'absolute', top: 46, left: 0, right: 0, backgroundColor: 'white', borderWidth: 1, borderColor: theme.colors.border, borderRadius: 8, zIndex: 999, maxHeight: 200, overflow: 'hidden' }}>
                      <TouchableOpacity onPress={() => { setField('broker_id', ''); setOpenDrop(null); }} style={{ padding: 11, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
                        <Text style={{ fontSize: 14, color: theme.colors.textLight }}>— Nenhum —</Text>
                      </TouchableOpacity>
                      {corretores.map(b => (
                        <TouchableOpacity key={b.id} onPress={() => { setField('broker_id', b.id); setOpenDrop(null); }} style={{ padding: 11, borderBottomWidth: 1, borderBottomColor: theme.colors.border, backgroundColor: form.broker_id === b.id ? '#f1f5f9' : 'white' }}>
                          <Text style={{ fontSize: 14, color: theme.colors.text }}>{b.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </S.InputGroup>

              {/* Valor total + % comissão */}
              <S.Row>
                <S.FlexField>
                  <S.Label>Valor Total *</S.Label>
                  <S.StyledInput
                    placeholder="R$ 0,00"
                    value={form.total_value}
                    onChangeText={v => setField('total_value', maskMoney(v))}
                    keyboardType="numeric"
                    error={!!errors.total_value}
                  />
                  {errors.total_value && <S.ErrorText>{errors.total_value}</S.ErrorText>}
                </S.FlexField>
                <S.FlexField>
                  <S.Label>% Comissão</S.Label>
                  <S.StyledInput
                    placeholder="Ex: 6"
                    value={form.commission_percentage}
                    onChangeText={v => setField('commission_percentage', v.replace(',', '.'))}
                    keyboardType="numeric"
                  />
                </S.FlexField>
              </S.Row>

              {/* Valor comissão calculado */}
              <S.InputGroup>
                <S.Label>Valor da Comissão</S.Label>
                <S.StyledInput
                  placeholder="Calculado automaticamente"
                  value={form.commission_value}
                  onChangeText={v => setField('commission_value', maskMoney(v))}
                  keyboardType="numeric"
                />
              </S.InputGroup>

              {/* Status + Data */}
              <S.Row>
                <S.FlexField>
                  <S.Label>Status</S.Label>
                  <View style={{ zIndex: openDrop === 'status' ? 100 : 1 }}>
                    <S.SelectWrapper onPress={() => setOpenDrop(p => p === 'status' ? null : 'status')}>
                      <S.SelectText>{form.status}</S.SelectText>
                      <ChevronDown size={16} color={theme.colors.textLight} />
                    </S.SelectWrapper>
                    {openDrop === 'status' && (
                      <View style={{ position: 'absolute', top: 46, left: 0, right: 0, backgroundColor: 'white', borderWidth: 1, borderColor: theme.colors.border, borderRadius: 8, zIndex: 999, overflow: 'hidden' }}>
                        {STATUS_OPTIONS.map(s => (
                          <TouchableOpacity key={s} onPress={() => { setField('status', s); setOpenDrop(null); }} style={{ padding: 11, borderBottomWidth: 1, borderBottomColor: theme.colors.border, backgroundColor: form.status === s ? '#f1f5f9' : 'white' }}>
                            <Text style={{ fontSize: 14, color: theme.colors.text }}>{s}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                </S.FlexField>
                <S.FlexField>
                  <S.Label>Data da Venda</S.Label>
                  <S.StyledInput
                    placeholder="AAAA-MM-DD"
                    value={form.sale_date}
                    onChangeText={v => setField('sale_date', v)}
                  />
                </S.FlexField>
              </S.Row>

            </S.FormBody>

            <S.ModalFooter>
              <S.CancelButton onPress={closeModal}>
                <Text style={{ fontSize: 14, color: theme.colors.text }}>Cancelar</Text>
              </S.CancelButton>
              <S.SaveButton onPress={handleSave} disabled={saving}>
                {saving
                  ? <ActivityIndicator size="small" color="white" />
                  : <Text style={{ color: 'white', fontWeight: '700', fontSize: 14 }}>{editing ? 'Salvar' : 'Registrar'}</Text>
                }
              </S.SaveButton>
            </S.ModalFooter>

          </S.ModalBox>
        </S.ModalOverlay>
      </Modal>

    </S.Container>
  );
}

function SummaryCard({ label, value, icon }: any) {
  return (
    <S.SummaryCard>
      <S.CardHeader>
        <S.CardLabel>{label}</S.CardLabel>
        {icon}
      </S.CardHeader>
      <S.CardValue>{value}</S.CardValue>
    </S.SummaryCard>
  );
}
