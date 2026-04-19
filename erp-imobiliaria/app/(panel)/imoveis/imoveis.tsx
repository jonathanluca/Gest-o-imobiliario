import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, useWindowDimensions, Image,
  Modal, TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { Plus, Search, ChevronDown, Eye, Pencil, Trash2, X } from 'lucide-react-native';

import { theme } from '../../../theme';
import * as S from './imoveis.styles';

const API_URL = 'http://localhost:3000';

type Imovel = {
  id: string;
  title: string;
  type: string;
  status: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  area: number;
  bedrooms: number;
  suites: number;
  bathrooms: number;
  parking_spots: number;
  price: number;
  description: string;
  broker_id: string | null;
  images: string[];
  profiles?: { full_name: string } | null;
};

const emptyForm = {
  title: '', type: 'Apartamento', status: 'Disponível',
  address: '', city: '', state: '', zip_code: '',
  area: '0', bedrooms: '0', suites: '0', bathrooms: '0', parking_spots: '0',
  price: '0', broker_id: '', description: '',
};

const STATUS_LIST = ['Disponível', 'Reservado', 'Vendido'];

function formatPrice(value: number): string {
  return 'R$ ' + Number(value).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function Imoveis() {
  const { width } = useWindowDimensions();
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [showStatusPicker, setShowStatusPicker] = useState(false);

  const [modalFormVisible, setModalFormVisible] = useState(false);
  const [modalViewVisible, setModalViewVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Imovel | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  const cardWidth = width > 1100 ? '31.5%' : width > 768 ? '48%' : '100%';

  async function fetchImoveis() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchText.trim()) params.set('search', searchText.trim());
      if (statusFilter !== 'todos') params.set('status', statusFilter);
      const res = await fetch(`${API_URL}/api/imoveis?${params}`);
      if (!res.ok) throw new Error();
      setImoveis(await res.json());
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os imóveis.');
    } finally {
      setLoading(false);
    }
  }

  // Debounce na busca por texto
  useEffect(() => {
    const timer = setTimeout(fetchImoveis, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  // Filtro de status aplica imediatamente
  useEffect(() => {
    fetchImoveis();
  }, [statusFilter]);

  function openCreate() {
    setEditingId(null);
    setFormData({ ...emptyForm });
    setModalFormVisible(true);
  }

  function openEdit(imovel: Imovel) {
    setEditingId(imovel.id);
    setFormData({
      title: imovel.title,
      type: imovel.type,
      status: imovel.status,
      address: imovel.address,
      city: imovel.city,
      state: imovel.state,
      zip_code: imovel.zip_code,
      area: String(imovel.area),
      bedrooms: String(imovel.bedrooms),
      suites: String(imovel.suites),
      bathrooms: String(imovel.bathrooms),
      parking_spots: String(imovel.parking_spots),
      price: String(imovel.price),
      broker_id: imovel.broker_id || '',
      description: imovel.description,
    });
    setModalFormVisible(true);
  }

  async function handleSave() {
    if (!formData.title.trim() || !formData.address.trim() || !formData.city.trim()) {
      Alert.alert('Atenção', 'Preencha os campos obrigatórios: Título, Endereço e Cidade.');
      return;
    }
    try {
      setSaving(true);
      const body = {
        ...formData,
        area: parseFloat(formData.area) || 0,
        bedrooms: parseInt(formData.bedrooms) || 0,
        suites: parseInt(formData.suites) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        parking_spots: parseInt(formData.parking_spots) || 0,
        price: parseFloat(formData.price) || 0,
        broker_id: formData.broker_id || null,
        images: [],
      };
      const url = editingId ? `${API_URL}/api/imoveis/${editingId}` : `${API_URL}/api/imoveis`;
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      setModalFormVisible(false);
      fetchImoveis();
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o imóvel.');
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(id: string) {
    Alert.alert('Confirmar exclusão', 'Deseja excluir este imóvel permanentemente?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive',
        onPress: async () => {
          try {
            const res = await fetch(`${API_URL}/api/imoveis/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error();
            fetchImoveis();
          } catch {
            Alert.alert('Erro', 'Não foi possível excluir o imóvel.');
          }
        },
      },
    ]);
  }

  function field(key: keyof typeof emptyForm) {
    return {
      value: formData[key],
      onChangeText: (v: string) => setFormData(prev => ({ ...prev, [key]: v })),
    };
  }

  return (
    <S.Container>
      <S.HeaderRow>
        <S.TitleContainer>
          <S.Title>Imóveis</S.Title>
          <S.Subtitle>Gerencie o catálogo de imóveis</S.Subtitle>
        </S.TitleContainer>
        <S.AddButton onPress={openCreate}>
          <Plus size={20} color="white" />
          <S.AddButtonText>Novo Imóvel</S.AddButtonText>
        </S.AddButton>
      </S.HeaderRow>

      {/* FILTROS */}
      <S.FilterSection>
        <S.SearchInput>
          <Search size={18} color={theme.colors.textLight} />
          <TextInput
            placeholder="Buscar por título, cidade ou endereço..."
            style={{ flex: 1, marginLeft: 10, outlineStyle: 'none' } as any}
            value={searchText}
            onChangeText={setSearchText}
          />
        </S.SearchInput>

        <View style={{ position: 'relative' }}>
          <TouchableOpacity onPress={() => setShowStatusPicker(v => !v)}>
            <S.SelectInput>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: theme.colors.textLight }}>
                  {statusFilter === 'todos' ? 'Todos os status' : statusFilter}
                </Text>
                <ChevronDown size={18} color={theme.colors.textLight} />
              </View>
            </S.SelectInput>
          </TouchableOpacity>

          {showStatusPicker && (
            <View style={{
              position: 'absolute', top: 48, right: 0, zIndex: 99,
              backgroundColor: 'white', borderWidth: 1, borderColor: theme.colors.border,
              borderRadius: 8, width: 200, shadowColor: '#000', shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: 4 }, shadowRadius: 8,
            }}>
              {['todos', ...STATUS_LIST].map((s, i) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => { setStatusFilter(s); setShowStatusPicker(false); }}
                  style={{
                    padding: 12,
                    borderBottomWidth: i < STATUS_LIST.length ? 1 : 0,
                    borderBottomColor: theme.colors.border,
                  }}
                >
                  <Text>{s === 'todos' ? 'Todos os status' : s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </S.FilterSection>

      {/* GRID DE CARDS */}
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 48 }} />
      ) : imoveis.length === 0 ? (
        <Text style={{ color: theme.colors.textLight, textAlign: 'center', marginTop: 48 }}>
          Nenhum imóvel encontrado.
        </Text>
      ) : (
        <S.PropertyGrid>
          {imoveis.map((imovel) => (
            <S.Card key={imovel.id} style={{ width: cardWidth }}>
              <S.ImageContainer>
                {imovel.images?.[0] ? (
                  <Image source={{ uri: imovel.images[0] }} style={{ width: '100%', height: '100%' }} />
                ) : (
                  <View style={{ flex: 1, backgroundColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: theme.colors.textLight, fontSize: 12 }}>Sem imagem</Text>
                  </View>
                )}
                <S.Badge status={imovel.status}>
                  <S.BadgeText status={imovel.status}>{imovel.status}</S.BadgeText>
                </S.Badge>
              </S.ImageContainer>

              <S.CardContent>
                <S.PropertyType>{imovel.type}</S.PropertyType>
                <S.PropertyTitle numberOfLines={1}>{imovel.title}</S.PropertyTitle>
                <S.PropertyPrice>{formatPrice(imovel.price)}</S.PropertyPrice>
                <S.BrokerText>
                  {imovel.profiles?.full_name ?? 'Sem corretor'} •{' '}
                  {imovel.area}m² • {imovel.bedrooms} qts • {imovel.parking_spots} vgs
                </S.BrokerText>
                <S.ActionRow>
                  <S.ViewButton onPress={() => { setSelectedProperty(imovel); setModalViewVisible(true); }}>
                    <Eye size={16} color={theme.colors.text} />
                    <Text style={{ fontWeight: '500' }}>Ver</Text>
                  </S.ViewButton>
                  <S.IconButton color={theme.colors.border} onPress={() => openEdit(imovel)}>
                    <Pencil size={16} color={theme.colors.text} />
                  </S.IconButton>
                  <S.IconButton color="#fee2e2" onPress={() => handleDelete(imovel.id)}>
                    <Trash2 size={16} color={theme.colors.danger} />
                  </S.IconButton>
                </S.ActionRow>
              </S.CardContent>
            </S.Card>
          ))}
        </S.PropertyGrid>
      )}

      {/* ── MODAL FORM: CRIAR / EDITAR ─────────────────────────────────────── */}
      <Modal visible={modalFormVisible} animationType="fade" transparent>
        <S.ModalOverlay>
          <S.ModalContainer>
            <S.ModalHeader>
              <S.ModalTitle>{editingId ? 'Editar Imóvel' : 'Novo Imóvel'}</S.ModalTitle>
              <TouchableOpacity onPress={() => setModalFormVisible(false)}>
                <X size={20} color={theme.colors.textLight} />
              </TouchableOpacity>
            </S.ModalHeader>

            <S.FormScroll showsVerticalScrollIndicator={false}>
              <S.InputGroup>
                <S.Label>Título *</S.Label>
                <S.StyledInput placeholder="Ex: Apartamento Frente Mar" {...field('title')} />
              </S.InputGroup>

              <S.Row>
                <S.InputGroup style={{ flex: 1 }}>
                  <S.Label>Tipo *</S.Label>
                  <S.StyledInput placeholder="Apartamento" {...field('type')} />
                </S.InputGroup>
                <S.InputGroup style={{ flex: 1 }}>
                  <S.Label>Status *</S.Label>
                  <S.StyledInput placeholder="Disponível" {...field('status')} />
                </S.InputGroup>
              </S.Row>

              <S.InputGroup>
                <S.Label>Endereço *</S.Label>
                <S.StyledInput placeholder="Rua, número" {...field('address')} />
              </S.InputGroup>

              <S.Row>
                <S.InputGroup style={{ flex: 1 }}>
                  <S.Label>Cidade *</S.Label>
                  <S.StyledInput placeholder="São Paulo" {...field('city')} />
                </S.InputGroup>
                <S.InputGroup style={{ flex: 1 }}>
                  <S.Label>Estado</S.Label>
                  <S.StyledInput placeholder="SP" {...field('state')} />
                </S.InputGroup>
              </S.Row>

              <S.Row>
                <S.InputGroup style={{ flex: 1 }}>
                  <S.Label>CEP</S.Label>
                  <S.StyledInput placeholder="00000-000" {...field('zip_code')} />
                </S.InputGroup>
                <S.InputGroup style={{ flex: 1 }}>
                  <S.Label>Área (m²)</S.Label>
                  <S.StyledInput keyboardType="numeric" {...field('area')} />
                </S.InputGroup>
              </S.Row>

              <S.Row>
                <S.InputGroup style={{ flex: 1 }}>
                  <S.Label>Quartos</S.Label>
                  <S.StyledInput keyboardType="numeric" {...field('bedrooms')} />
                </S.InputGroup>
                <S.InputGroup style={{ flex: 1 }}>
                  <S.Label>Suítes</S.Label>
                  <S.StyledInput keyboardType="numeric" {...field('suites')} />
                </S.InputGroup>
              </S.Row>

              <S.Row>
                <S.InputGroup style={{ flex: 1 }}>
                  <S.Label>Banheiros</S.Label>
                  <S.StyledInput keyboardType="numeric" {...field('bathrooms')} />
                </S.InputGroup>
                <S.InputGroup style={{ flex: 1 }}>
                  <S.Label>Vagas</S.Label>
                  <S.StyledInput keyboardType="numeric" {...field('parking_spots')} />
                </S.InputGroup>
              </S.Row>

              <S.InputGroup>
                <S.Label>Preço (R$) *</S.Label>
                <S.StyledInput keyboardType="numeric" placeholder="0" {...field('price')} />
              </S.InputGroup>

              <S.InputGroup>
                <S.Label>Descrição</S.Label>
                <S.StyledTextArea multiline numberOfLines={4} {...field('description')} />
              </S.InputGroup>

              <S.ModalFooter>
                <S.CancelButton onPress={() => setModalFormVisible(false)}>
                  <Text>Cancelar</Text>
                </S.CancelButton>
                <S.SaveButton onPress={handleSave} disabled={saving}>
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    {saving ? 'Salvando...' : 'Salvar'}
                  </Text>
                </S.SaveButton>
              </S.ModalFooter>
            </S.FormScroll>
          </S.ModalContainer>
        </S.ModalOverlay>
      </Modal>

      {/* ── MODAL VER DETALHES ─────────────────────────────────────────────── */}
      <Modal visible={modalViewVisible} animationType="fade" transparent>
        <S.ModalOverlay>
          <S.ModalContainer>
            <S.ModalHeader>
              <S.ModalTitle>Detalhes do Imóvel</S.ModalTitle>
              <TouchableOpacity onPress={() => setModalViewVisible(false)}>
                <X size={20} color={theme.colors.textLight} />
              </TouchableOpacity>
            </S.ModalHeader>

            {selectedProperty && (
              <S.FormScroll showsVerticalScrollIndicator={false}>
                {selectedProperty.images?.[0] ? (
                  <Image
                    source={{ uri: selectedProperty.images[0] }}
                    style={{ width: '100%', height: 200, borderRadius: 8, marginBottom: 16 }}
                  />
                ) : (
                  <View style={{
                    width: '100%', height: 140, borderRadius: 8,
                    backgroundColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
                  }}>
                    <Text style={{ color: theme.colors.textLight }}>Sem imagem</Text>
                  </View>
                )}

                <Text style={{ fontSize: 22, fontWeight: 'bold', color: theme.colors.primary }}>
                  {formatPrice(selectedProperty.price)}
                </Text>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 4 }}>
                  {selectedProperty.title}
                </Text>
                <Text style={{ color: theme.colors.textLight, marginBottom: 4 }}>
                  {selectedProperty.address}
                </Text>
                <Text style={{ color: theme.colors.textLight, marginBottom: 16 }}>
                  {selectedProperty.city}{selectedProperty.state ? ` - ${selectedProperty.state}` : ''}
                </Text>

                <S.Label>Características</S.Label>
                <Text style={{ marginBottom: 16 }}>
                  {selectedProperty.area}m² • {selectedProperty.bedrooms} quartos • {selectedProperty.suites} suítes •{' '}
                  {selectedProperty.bathrooms} banheiros • {selectedProperty.parking_spots} vagas
                </Text>

                {selectedProperty.profiles?.full_name && (
                  <>
                    <S.Label>Corretor</S.Label>
                    <Text style={{ marginBottom: 16 }}>{selectedProperty.profiles.full_name}</Text>
                  </>
                )}

                {selectedProperty.description ? (
                  <>
                    <S.Label>Descrição</S.Label>
                    <Text style={{ color: theme.colors.text, lineHeight: 20 }}>
                      {selectedProperty.description}
                    </Text>
                  </>
                ) : null}

                <S.ModalFooter>
                  <S.CancelButton style={{ width: '100%' }} onPress={() => setModalViewVisible(false)}>
                    <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Fechar</Text>
                  </S.CancelButton>
                </S.ModalFooter>
              </S.FormScroll>
            )}
          </S.ModalContainer>
        </S.ModalOverlay>
      </Modal>
    </S.Container>
  );
}
