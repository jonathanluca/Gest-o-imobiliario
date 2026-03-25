import React, { useState } from 'react';
import { View, Text, TextInput, useWindowDimensions, Image, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Plus, Search, ChevronDown, Eye, Pencil, Trash2, X, Sparkles } from 'lucide-react-native';

import { theme } from '../../../theme'; 
import * as S from './imoveis.styles';

const imoveisMock = [
  {
    id: 1,
    titulo: 'Apartamento Luxo Frente Mar',
    endereco: 'Av. Atlântica, 1000, Rio de Janeiro - RJ',
    tipo: 'APARTAMENTO',
    preco: 'R$ 2.500.000,00',
    status: 'Disponível',
    specs: '180m² • 3 quartos • 2 vagas',
    corretor: 'João Corretor',
    imagem: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80',
    descricao: 'Lindo apartamento com vista total para o mar, finamente decorado.'
  },
  {
    id: 2,
    titulo: 'Casa de Condomínio',
    endereco: 'Rua das Flores, 500, São Paulo - SP',
    tipo: 'CASA',
    preco: 'R$ 1.800.000,00',
    status: 'Disponível',
    specs: '350m² • 4 quartos • 4 vagas',
    corretor: 'Maria Corretora',
    imagem: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=400&q=80',
    descricao: 'Casa ampla com piscina e área gourmet completa.'
  }
];

export default function Imoveis() {
  const { width } = useWindowDimensions();
  const [modalCreateVisible, setModalCreateVisible] = useState(false);
  const [modalViewVisible, setModalViewVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  const cardWidth = width > 1100 ? '31.5%' : width > 768 ? '48%' : '100%';

  const handleOpenView = (imovel: any) => {
    setSelectedProperty(imovel);
    setModalViewVisible(true);
  };

  return (
    <S.Container>
      <S.HeaderRow>
        <S.TitleContainer>
          <S.Title>Imóveis</S.Title>
          <S.Subtitle>Gerencie o catálogo de imóveis</S.Subtitle>
        </S.TitleContainer>
        <S.AddButton onPress={() => setModalCreateVisible(true)}>
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
          />
        </S.SearchInput>

        <S.SelectInput>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: theme.colors.textLight }}>Todos os status</Text>
            <ChevronDown size={18} color={theme.colors.textLight} />
          </View>
        </S.SelectInput>
      </S.FilterSection>

      {/* GRID DE CARDS */}
      <S.PropertyGrid>
        {imoveisMock.map((imovel) => (
          <S.Card key={imovel.id} style={{ width: cardWidth }}>
            <S.ImageContainer>
              <Image source={{ uri: imovel.imagem }} style={{ width: '100%', height: '100%' }} />
              <S.Badge status={imovel.status}>
                <S.BadgeText status={imovel.status}>{imovel.status}</S.BadgeText>
              </S.Badge>
            </S.ImageContainer>
            <S.CardContent>
              <S.PropertyType>{imovel.tipo}</S.PropertyType>
              <S.PropertyTitle numberOfLines={1}>{imovel.titulo}</S.PropertyTitle>
              <S.PropertyPrice>{imovel.preco}</S.PropertyPrice>
              <S.ActionRow>
                <S.ViewButton onPress={() => handleOpenView(imovel)}>
                  <Eye size={16} color={theme.colors.text} />
                  <Text style={{ fontWeight: '500' }}>Ver</Text>
                </S.ViewButton>
                <S.IconButton color={theme.colors.border}><Pencil size={16} color={theme.colors.text} /></S.IconButton>
                <S.IconButton color="#fee2e2"><Trash2 size={16} color={theme.colors.danger} /></S.IconButton>
              </S.ActionRow>
            </S.CardContent>
          </S.Card>
        ))}
      </S.PropertyGrid>

      {/* --------------------------------------------------------- */}
      {/* MODAL 1: NOVO IMÓVEL */}
      <Modal visible={modalCreateVisible} animationType="fade" transparent>
        <S.ModalOverlay>
          <S.ModalContainer>
            <S.ModalHeader>
              <S.ModalTitle>Novo Imóvel</S.ModalTitle>
              <TouchableOpacity onPress={() => setModalCreateVisible(false)}>
                <X size={20} color={theme.colors.textLight} />
              </TouchableOpacity>
            </S.ModalHeader>

              <S.FormScroll showsVerticalScrollIndicator={false}>
              <S.InputGroup>
                <S.Label>Título *</S.Label>
                <S.StyledInput placeholder="Digite o título do anúncio" />
              </S.InputGroup>

              <S.Row>
                <S.InputGroup style={{ flex: 1 }}>
                  <S.Label>Tipo *</S.Label>
                  <S.SelectWrapper>
                    <Text>Apartamento</Text>
                    <ChevronDown size={16} color={theme.colors.textLight} />
                  </S.SelectWrapper>
                </S.InputGroup>
                <S.InputGroup style={{ flex: 1 }}>
                  <S.Label>Status *</S.Label>
                  <S.SelectWrapper>
                    <Text>Disponível</Text>
                    <ChevronDown size={16} color={theme.colors.textLight} />
                  </S.SelectWrapper>
                </S.InputGroup>
              </S.Row>

              <S.InputGroup><S.Label>Endereço *</S.Label><S.StyledInput /></S.InputGroup>

              <S.Row>
                <S.InputGroup style={{ flex: 1 }}><S.Label>Cidade *</S.Label><S.StyledInput /></S.InputGroup>
                <S.InputGroup style={{ flex: 1 }}><S.Label>Estado *</S.Label><S.StyledInput /></S.InputGroup>
              </S.Row>

              <S.Row>
                <S.InputGroup style={{ flex: 1 }}><S.Label>CEP *</S.Label><S.StyledInput /></S.InputGroup>
                <S.InputGroup style={{ flex: 1 }}><S.Label>Área (m²) *</S.Label><S.StyledInput defaultValue="0" keyboardType="numeric" /></S.InputGroup>
              </S.Row>

              <S.Row>
                <S.InputGroup style={{ flex: 1 }}><S.Label>Quartos</S.Label><S.StyledInput defaultValue="0" keyboardType="numeric" /></S.InputGroup>
                <S.InputGroup style={{ flex: 1 }}><S.Label>Suítes</S.Label><S.StyledInput defaultValue="0" keyboardType="numeric" /></S.InputGroup>
              </S.Row>

              <S.Row>
                <S.InputGroup style={{ flex: 1 }}><S.Label>Banheiros</S.Label><S.StyledInput defaultValue="0" keyboardType="numeric" /></S.InputGroup>
                <S.InputGroup style={{ flex: 1 }}><S.Label>Vagas</S.Label><S.StyledInput defaultValue="0" keyboardType="numeric" /></S.InputGroup>
              </S.Row>

              <S.Row>
                <S.InputGroup style={{ flex: 1 }}><S.Label>Preço *</S.Label><S.StyledInput defaultValue="0" keyboardType="numeric" /></S.InputGroup>
                <S.InputGroup style={{ flex: 1 }}>
                  <S.Label>Corretor *</S.Label>
                  <S.SelectWrapper>
                    <Text>Selecionar...</Text>
                    <ChevronDown size={16} color={theme.colors.textLight} />
                  </S.SelectWrapper>
                </S.InputGroup>
              </S.Row>

              <S.InputGroup>
                <S.Label>Descrição *</S.Label>
                <S.StyledTextArea multiline numberOfLines={4} />
                <S.AIButton>
                  <Sparkles size={16} color={theme.colors.text} />
                  <S.AIButtonText>Sugerir Descrição</S.AIButtonText>
                </S.AIButton>
              </S.InputGroup>

              <S.ModalFooter>
                <S.CancelButton onPress={() => setModalCreateVisible(false)}>
                  <Text>Cancelar</Text>
                </S.CancelButton>
                <S.SaveButton onPress={() => setModalCreateVisible(false)}>
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Salvar</Text>
                </S.SaveButton>
              </S.ModalFooter>
            </S.FormScroll>
          </S.ModalContainer>
        </S.ModalOverlay>
      </Modal>

      {/* --------------------------------------------------------- */}
      {/* MODAL 2: DETALHES DO IMÓVEL (VER) */}
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
                <Image 
                  source={{ uri: selectedProperty.imagem }} 
                  style={{ width: '100%', height: 200, borderRadius: 8, marginBottom: 16 }} 
                />
                <Text style={{ fontSize: 22, fontWeight: 'bold', color: theme.colors.primary }}>
                  {selectedProperty.preco}
                </Text>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 4 }}>
                  {selectedProperty.titulo}
                </Text>
                <Text style={{ color: theme.colors.textLight, marginBottom: 16 }}>
                  {selectedProperty.endereco}
                </Text>
                
                <S.Label>Características</S.Label>
                <Text style={{ marginBottom: 16 }}>{selectedProperty.specs}</Text>

                <S.Label>Descrição</S.Label>
                <Text style={{ color: theme.colors.text, lineHeight: 20 }}>
                  {selectedProperty.descricao}
                </Text>
                
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