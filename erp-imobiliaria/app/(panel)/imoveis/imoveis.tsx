import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, useWindowDimensions, Image,
  Modal, TouchableOpacity, Alert, ActivityIndicator, Platform,
} from 'react-native';
import { Plus, Search, ChevronDown, Eye, Pencil, Trash2, X, ImageOff } from 'lucide-react-native';

import { theme } from '../../../theme';
import { getToken } from '../../auth';
import * as S from './imoveis.styles';

const API_URL = 'http://localhost:3000';

const TYPE_LIST  = ['Apartamento', 'Casa', 'Terreno', 'Comercial', 'Cobertura', 'Studio', 'Outro'];
const STATUS_LIST = ['Disponível', 'Reservado', 'Vendido'];

// Imagens de exemplo para usar quando não há URL cadastrada
const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80',
];

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
  broker?: { full_name: string } | null;
};

const emptyForm = {
  title: '',
  type: 'Apartamento',
  status: 'Disponível',
  address: '',
  city: '',
  state: '',
  zip_code: '',
  area: '',
  bedrooms: '',
  suites: '',
  bathrooms: '',
  parking_spots: '',
  price: '',
  image_url: '',
  description: '',
};

type FormErrors = Partial<Record<keyof typeof emptyForm, string>>;

function formatPrice(v: number) {
  return 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

function getCardImage(imovel: Imovel) {
  if (imovel.images?.[0]) return imovel.images[0];
  // imagem placeholder baseada no id para consistência
  const idx = imovel.id.charCodeAt(0) % PLACEHOLDER_IMAGES.length;
  return PLACEHOLDER_IMAGES[idx];
}

export default function Imoveis() {
  const { width } = useWindowDimensions();
  const cardWidth = width > 1100 ? '31.5%' : width > 768 ? '48%' : '100%';

  const [imoveis, setImoveis]             = useState<Imovel[]>([]);
  const [loading, setLoading]             = useState(true);
  const [searchText, setSearchText]       = useState('');
  const [statusFilter, setStatusFilter]   = useState('todos');
  const [showStatusPicker, setShowStatusPicker] = useState(false);

  const [modalFormVisible, setModalFormVisible] = useState(false);
  const [modalViewVisible, setModalViewVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Imovel | null>(null);
  const [editingId, setEditingId]         = useState<string | null>(null);
  const [form, setForm]                   = useState({ ...emptyForm });
  const [errors, setErrors]              = useState<FormErrors>({});
  const [saving, setSaving]               = useState(false);
  const [deletingId, setDeletingId]       = useState<string | null>(null);
  const [showTypePicker, setShowTypePicker]     = useState(false);
  const [showModalStatus, setShowModalStatus]   = useState(false);

  const searchTimer = useRef<any>(null);

  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => fetchImoveis(), 500);
    return () => clearTimeout(searchTimer.current);
  }, [searchText]);

  useEffect(() => { fetchImoveis(); }, [statusFilter]);

  async function fetchImoveis() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchText.trim()) params.set('search', searchText.trim());
      if (statusFilter !== 'todos') params.set('status', statusFilter);
      const res = await fetch(`${API_URL}/api/imoveis?${params}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error();
      setImoveis(await res.json());
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os imóveis.');
    } finally {
      setLoading(false);
    }
  }

  function setField(key: keyof typeof emptyForm, value: string) {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  }

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setErrors({});
    setShowTypePicker(false);
    setShowModalStatus(false);
    setModalFormVisible(true);
  }

  function openEdit(imovel: Imovel) {
    setEditingId(imovel.id);
    setForm({
      title:         imovel.title ?? '',
      type:          imovel.type ?? 'Apartamento',
      status:        imovel.status ?? 'Disponível',
      address:       imovel.address ?? '',
      city:          imovel.city ?? '',
      state:         imovel.state ?? '',
      zip_code:      imovel.zip_code ?? '',
      area:          imovel.area ? String(imovel.area) : '',
      bedrooms:      imovel.bedrooms ? String(imovel.bedrooms) : '',
      suites:        imovel.suites ? String(imovel.suites) : '',
      bathrooms:     imovel.bathrooms ? String(imovel.bathrooms) : '',
      parking_spots: imovel.parking_spots ? String(imovel.parking_spots) : '',
      price:         imovel.price ? String(imovel.price) : '',
      image_url:     imovel.images?.[0] ?? '',
      description:   imovel.description ?? '',
    });
    setErrors({});
    setShowTypePicker(false);
    setShowModalStatus(false);
    setModalFormVisible(true);
  }

  function validate() {
    const e: FormErrors = {};
    if (!form.title.trim())   e.title   = 'Título é obrigatório';
    if (!form.address.trim()) e.address = 'Endereço é obrigatório';
    if (!form.city.trim())    e.city    = 'Cidade é obrigatória';
    if (!form.price.trim() || isNaN(Number(form.price))) e.price = 'Preço inválido';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      const body = {
        title:         form.title.trim(),
        type:          form.type,
        status:        form.status,
        address:       form.address.trim(),
        city:          form.city.trim(),
        state:         form.state.trim(),
        zip_code:      form.zip_code.trim(),
        area:          parseFloat(form.area) || 0,
        bedrooms:      parseInt(form.bedrooms) || 0,
        suites:        parseInt(form.suites) || 0,
        bathrooms:     parseInt(form.bathrooms) || 0,
        parking_spots: parseInt(form.parking_spots) || 0,
        price:         parseFloat(form.price) || 0,
        broker_id:     null,
        description:   form.description.trim(),
        images:        form.image_url.trim() ? [form.image_url.trim()] : [],
      };

      const url = editingId
        ? `${API_URL}/api/imoveis/${editingId}`
        : `${API_URL}/api/imoveis`;

      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        Alert.alert('Erro', d.error || 'Não foi possível salvar o imóvel.');
        return;
      }
      setModalFormVisible(false);
      fetchImoveis();
    } catch {
      Alert.alert('Erro', 'Falha na conexão com o servidor.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(imovel: Imovel) {
    const confirmed = Platform.OS === 'web'
      ? (window as any).confirm(`Excluir "${imovel.title}"? Esta ação não pode ser desfeita.`)
      : await new Promise<boolean>(resolve =>
          Alert.alert('Excluir imóvel', `Deseja excluir "${imovel.title}"?`, [
            { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
            { text: 'Excluir',  style: 'destructive', onPress: () => resolve(true) },
          ])
        );

    if (!confirmed) return;
    setDeletingId(imovel.id);
    try {
      const res = await fetch(`${API_URL}/api/imoveis/${imovel.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error();
      fetchImoveis();
    } catch {
      Alert.alert('Erro', 'Não foi possível excluir o imóvel.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <S.Container>
      {/* Cabeçalho */}
      <S.HeaderRow>
        <S.TitleContainer>
          <S.Title>Imóveis</S.Title>
          <S.Subtitle>{imoveis.length} {imoveis.length === 1 ? 'imóvel' : 'imóveis'} no catálogo</S.Subtitle>
        </S.TitleContainer>
        <S.AddButton onPress={openCreate}>
          <Plus size={18} color="white" />
          <S.AddButtonText>Novo Imóvel</S.AddButtonText>
        </S.AddButton>
      </S.HeaderRow>

      {/* Filtros */}
      <S.FilterSection>
        <S.SearchInput>
          <Search size={16} color={theme.colors.textLight} />
          <TextInput
            placeholder="Buscar por título, cidade ou endereço..."
            placeholderTextColor={theme.colors.textLight}
            style={{ flex: 1, fontSize: 14, color: theme.colors.text, outlineStyle: 'none' } as any}
            value={searchText}
            onChangeText={setSearchText}
          />
        </S.SearchInput>

        <View style={{ position: 'relative' }}>
          <TouchableOpacity onPress={() => setShowStatusPicker(v => !v)}>
            <S.SelectInput>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: theme.colors.text, fontSize: 14 }}>
                  {statusFilter === 'todos' ? 'Todos os status' : statusFilter}
                </Text>
                <ChevronDown size={16} color={theme.colors.textLight} />
              </View>
            </S.SelectInput>
          </TouchableOpacity>
          {showStatusPicker && (
            <View style={{
              position: 'absolute', top: 48, right: 0, zIndex: 99,
              backgroundColor: 'white', borderWidth: 1, borderColor: theme.colors.border,
              borderRadius: 8, width: 200,
            }}>
              {['todos', ...STATUS_LIST].map(s => (
                <TouchableOpacity
                  key={s}
                  onPress={() => { setStatusFilter(s); setShowStatusPicker(false); }}
                  style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}
                >
                  <Text style={{ fontSize: 14 }}>{s === 'todos' ? 'Todos os status' : s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </S.FilterSection>

      {/* Grid */}
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 64 }} />
      ) : imoveis.length === 0 ? (
        <S.EmptyState>
          <S.EmptyText>{searchText ? 'Nenhum resultado encontrado.' : 'Nenhum imóvel cadastrado.'}</S.EmptyText>
        </S.EmptyState>
      ) : (
        <S.PropertyGrid>
          {imoveis.map(imovel => (
            <S.Card key={imovel.id} style={{ width: cardWidth }}>
              <S.ImageContainer>
                <Image
                  source={{ uri: getCardImage(imovel) }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
                <S.Badge status={imovel.status}>
                  <S.BadgeText status={imovel.status}>{imovel.status}</S.BadgeText>
                </S.Badge>
              </S.ImageContainer>

              <S.CardContent>
                <S.PropertyType>{imovel.type}</S.PropertyType>
                <S.PropertyTitle numberOfLines={1}>{imovel.title}</S.PropertyTitle>
                <S.PropertyPrice>{formatPrice(imovel.price)}</S.PropertyPrice>
                <S.BrokerText>
                  {[
                    imovel.area ? `${imovel.area}m²` : null,
                    imovel.bedrooms ? `${imovel.bedrooms} qts` : null,
                    imovel.bathrooms ? `${imovel.bathrooms} ban` : null,
                    imovel.parking_spots ? `${imovel.parking_spots} vgs` : null,
                  ].filter(Boolean).join(' · ')}
                  {imovel.broker?.full_name ? `\n${imovel.broker.full_name}` : ''}
                </S.BrokerText>
                <S.ActionRow>
                  <S.ViewButton onPress={() => { setSelectedProperty(imovel); setModalViewVisible(true); }}>
                    <Eye size={15} color={theme.colors.text} />
                    <Text style={{ fontSize: 13, fontWeight: '500' }}>Ver</Text>
                  </S.ViewButton>
                  <S.IconButton color={theme.colors.border} onPress={() => openEdit(imovel)}>
                    <Pencil size={15} color={theme.colors.text} />
                  </S.IconButton>
                  <S.IconButton color="#fee2e2" onPress={() => handleDelete(imovel)} disabled={deletingId === imovel.id}>
                    {deletingId === imovel.id
                      ? <ActivityIndicator size="small" color="#ef4444" />
                      : <Trash2 size={15} color="#ef4444" />
                    }
                  </S.IconButton>
                </S.ActionRow>
              </S.CardContent>
            </S.Card>
          ))}
        </S.PropertyGrid>
      )}

      {/* ── MODAL FORM ────────────────────────────────────────────────────── */}
      <Modal visible={modalFormVisible} animationType="fade" transparent onRequestClose={() => setModalFormVisible(false)}>
        <S.ModalOverlay>
          <S.ModalContainer>
            <S.ModalHeader>
              <S.ModalTitle>{editingId ? 'Editar Imóvel' : 'Novo Imóvel'}</S.ModalTitle>
              <TouchableOpacity onPress={() => setModalFormVisible(false)}>
                <X size={20} color={theme.colors.textLight} />
              </TouchableOpacity>
            </S.ModalHeader>

            <S.FormScroll showsVerticalScrollIndicator>
              <S.FormBody>
                {/* Título */}
                <S.InputGroup>
                  <S.Label>Título *</S.Label>
                  <S.StyledInput
                    placeholder="Ex: Apartamento Frente Mar"
                    placeholderTextColor={theme.colors.textLight}
                    value={form.title}
                    onChangeText={v => setField('title', v)}
                    error={!!errors.title}
                  />
                  {errors.title && <S.ErrorText>{errors.title}</S.ErrorText>}
                </S.InputGroup>

                {/* Tipo e Status */}
                <S.Row>
                  <S.FlexField>
                    <S.Label>Tipo</S.Label>
                    <S.SelectWrapper onPress={() => { setShowTypePicker(v => !v); setShowModalStatus(false); }}>
                      <S.SelectText>{form.type}</S.SelectText>
                      <ChevronDown size={15} color={theme.colors.textLight} />
                    </S.SelectWrapper>
                    {showTypePicker && (
                      <S.DropdownMenu>
                        {TYPE_LIST.map(t => (
                          <S.DropdownItem key={t} onPress={() => { setField('type', t); setShowTypePicker(false); }}>
                            <S.DropdownItemText>{t}</S.DropdownItemText>
                          </S.DropdownItem>
                        ))}
                      </S.DropdownMenu>
                    )}
                  </S.FlexField>
                  <S.FlexField>
                    <S.Label>Status</S.Label>
                    <S.SelectWrapper onPress={() => { setShowModalStatus(v => !v); setShowTypePicker(false); }}>
                      <S.SelectText>{form.status}</S.SelectText>
                      <ChevronDown size={15} color={theme.colors.textLight} />
                    </S.SelectWrapper>
                    {showModalStatus && (
                      <S.DropdownMenu>
                        {STATUS_LIST.map(s => (
                          <S.DropdownItem key={s} onPress={() => { setField('status', s); setShowModalStatus(false); }}>
                            <S.DropdownItemText>{s}</S.DropdownItemText>
                          </S.DropdownItem>
                        ))}
                      </S.DropdownMenu>
                    )}
                  </S.FlexField>
                </S.Row>

                {/* Endereço */}
                <S.InputGroup>
                  <S.Label>Endereço *</S.Label>
                  <S.StyledInput
                    placeholder="Rua, número"
                    placeholderTextColor={theme.colors.textLight}
                    value={form.address}
                    onChangeText={v => setField('address', v)}
                    error={!!errors.address}
                  />
                  {errors.address && <S.ErrorText>{errors.address}</S.ErrorText>}
                </S.InputGroup>

                {/* Cidade / Estado */}
                <S.Row>
                  <S.FlexField>
                    <S.Label>Cidade *</S.Label>
                    <S.StyledInput
                      placeholder="São Paulo"
                      placeholderTextColor={theme.colors.textLight}
                      value={form.city}
                      onChangeText={v => setField('city', v)}
                      error={!!errors.city}
                    />
                    {errors.city && <S.ErrorText>{errors.city}</S.ErrorText>}
                  </S.FlexField>
                  <S.FlexField>
                    <S.Label>Estado</S.Label>
                    <S.StyledInput
                      placeholder="SP"
                      placeholderTextColor={theme.colors.textLight}
                      value={form.state}
                      onChangeText={v => setField('state', v)}
                      maxLength={2}
                    />
                  </S.FlexField>
                  <S.FlexField>
                    <S.Label>CEP</S.Label>
                    <S.StyledInput
                      placeholder="00000-000"
                      placeholderTextColor={theme.colors.textLight}
                      value={form.zip_code}
                      onChangeText={v => setField('zip_code', v)}
                      keyboardType="numeric"
                    />
                  </S.FlexField>
                </S.Row>

                {/* Área e Preço */}
                <S.Row>
                  <S.FlexField>
                    <S.Label>Área (m²)</S.Label>
                    <S.StyledInput
                      placeholder="0"
                      placeholderTextColor={theme.colors.textLight}
                      value={form.area}
                      onChangeText={v => setField('area', v)}
                      keyboardType="numeric"
                    />
                  </S.FlexField>
                  <S.FlexField>
                    <S.Label>Preço (R$) *</S.Label>
                    <S.StyledInput
                      placeholder="0"
                      placeholderTextColor={theme.colors.textLight}
                      value={form.price}
                      onChangeText={v => setField('price', v)}
                      keyboardType="numeric"
                      error={!!errors.price}
                    />
                    {errors.price && <S.ErrorText>{errors.price}</S.ErrorText>}
                  </S.FlexField>
                </S.Row>

                {/* Quartos / Suítes / Banheiros / Vagas */}
                <S.Row>
                  {(['bedrooms', 'suites', 'bathrooms', 'parking_spots'] as const).map((key, i) => (
                    <S.FlexField key={key}>
                      <S.Label>{['Quartos', 'Suítes', 'Banheiros', 'Vagas'][i]}</S.Label>
                      <S.StyledInput
                        placeholder="0"
                        placeholderTextColor={theme.colors.textLight}
                        value={form[key]}
                        onChangeText={v => setField(key, v)}
                        keyboardType="numeric"
                      />
                    </S.FlexField>
                  ))}
                </S.Row>

                {/* URL da imagem */}
                <S.InputGroup>
                  <S.Label>URL da imagem</S.Label>
                  <S.StyledInput
                    placeholder="https://exemplo.com/foto.jpg"
                    placeholderTextColor={theme.colors.textLight}
                    value={form.image_url}
                    onChangeText={v => setField('image_url', v)}
                    autoCapitalize="none"
                  />
                  {form.image_url.trim() ? (
                    <S.ImagePreview source={{ uri: form.image_url }} resizeMode="cover" />
                  ) : (
                    <S.ImagePlaceholder>
                      <ImageOff size={24} color={theme.colors.textLight} />
                      <S.ImagePlaceholderText>Pré-visualização da imagem</S.ImagePlaceholderText>
                    </S.ImagePlaceholder>
                  )}
                </S.InputGroup>

                {/* Descrição */}
                <S.InputGroup>
                  <S.Label>Descrição</S.Label>
                  <S.StyledTextArea
                    placeholder="Descreva o imóvel..."
                    placeholderTextColor={theme.colors.textLight}
                    value={form.description}
                    onChangeText={v => setField('description', v)}
                    multiline
                    numberOfLines={4}
                  />
                </S.InputGroup>
              </S.FormBody>
            </S.FormScroll>

            <S.ModalFooter>
              <S.CancelButton onPress={() => setModalFormVisible(false)}>
                <Text style={{ fontSize: 14 }}>Cancelar</Text>
              </S.CancelButton>
              <S.SaveButton onPress={handleSave} disabled={saving}>
                {saving
                  ? <ActivityIndicator size="small" color="white" />
                  : <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>
                      {editingId ? 'Salvar alterações' : 'Cadastrar'}
                    </Text>
                }
              </S.SaveButton>
            </S.ModalFooter>
          </S.ModalContainer>
        </S.ModalOverlay>
      </Modal>

      {/* ── MODAL DETALHES ────────────────────────────────────────────────── */}
      <Modal visible={modalViewVisible} animationType="fade" transparent onRequestClose={() => setModalViewVisible(false)}>
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
                <S.FormBody>
                  <Image
                    source={{ uri: getCardImage(selectedProperty) }}
                    style={{ width: '100%', height: 200, borderRadius: 10, marginBottom: 4 }}
                    resizeMode="cover"
                  />
                  <S.Badge status={selectedProperty.status} style={{ alignSelf: 'flex-start', marginBottom: 12 }}>
                    <S.BadgeText status={selectedProperty.status}>{selectedProperty.status}</S.BadgeText>
                  </S.Badge>

                  <Text style={{ fontSize: 22, fontWeight: 'bold', color: theme.colors.primary, marginBottom: 4 }}>
                    {formatPrice(selectedProperty.price)}
                  </Text>
                  <Text style={{ fontSize: 17, fontWeight: 'bold', color: theme.colors.text, marginBottom: 2 }}>
                    {selectedProperty.title}
                  </Text>
                  <Text style={{ fontSize: 13, color: theme.colors.textLight, marginBottom: 2 }}>
                    {selectedProperty.type}
                  </Text>
                  <Text style={{ fontSize: 13, color: theme.colors.textLight, marginBottom: 16 }}>
                    {selectedProperty.address}{selectedProperty.city ? `, ${selectedProperty.city}` : ''}{selectedProperty.state ? ` - ${selectedProperty.state}` : ''}
                  </Text>

                  <View style={{
                    flexDirection: 'row', flexWrap: 'wrap', gap: 10,
                    backgroundColor: '#f8fafc', borderRadius: 10, padding: 14, marginBottom: 16,
                  }}>
                    {[
                      { label: 'Área', value: selectedProperty.area ? `${selectedProperty.area} m²` : '—' },
                      { label: 'Quartos', value: String(selectedProperty.bedrooms || '—') },
                      { label: 'Suítes', value: String(selectedProperty.suites || '—') },
                      { label: 'Banheiros', value: String(selectedProperty.bathrooms || '—') },
                      { label: 'Vagas', value: String(selectedProperty.parking_spots || '—') },
                    ].map(item => (
                      <View key={item.label} style={{ alignItems: 'center', minWidth: 70 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.text }}>{item.value}</Text>
                        <Text style={{ fontSize: 11, color: theme.colors.textLight }}>{item.label}</Text>
                      </View>
                    ))}
                  </View>

                  {selectedProperty.broker?.full_name && (
                    <View style={{ marginBottom: 12 }}>
                      <S.Label>Corretor</S.Label>
                      <Text style={{ fontSize: 14, color: theme.colors.text }}>{selectedProperty.broker.full_name}</Text>
                    </View>
                  )}

                  {selectedProperty.description ? (
                    <View>
                      <S.Label>Descrição</S.Label>
                      <Text style={{ fontSize: 14, color: theme.colors.text, lineHeight: 22 }}>
                        {selectedProperty.description}
                      </Text>
                    </View>
                  ) : null}
                </S.FormBody>
              </S.FormScroll>
            )}

            <S.ModalFooter>
              <S.CancelButton style={{ flex: 1, alignItems: 'center' }} onPress={() => setModalViewVisible(false)}>
                <Text style={{ fontWeight: '600' }}>Fechar</Text>
              </S.CancelButton>
              {selectedProperty && (
                <S.SaveButton onPress={() => { setModalViewVisible(false); openEdit(selectedProperty); }}>
                  <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>Editar</Text>
                </S.SaveButton>
              )}
            </S.ModalFooter>
          </S.ModalContainer>
        </S.ModalOverlay>
      </Modal>
    </S.Container>
  );
}
