import React from 'react';
import { View, Text, TextInput, useWindowDimensions, Image } from 'react-native';
import { Plus, Search, ChevronDown, Eye, Pencil, Trash2, MapPin } from 'lucide-react-native';
import { theme } from '../../../theme';
import * as S from './imoveis.styles';

// Mock de dados baseado no seu layout
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
    imagem: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 2,
    titulo: 'Casa de Condomínio com...',
    endereco: 'Rua das Flores, 500, São Paulo - SP',
    tipo: 'CASA',
    preco: 'R$ 1.800.000,00',
    status: 'Disponível',
    specs: '350m² • 4 quartos • 4 vagas',
    corretor: 'Maria Corretora',
    imagem: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 3,
    titulo: 'Apartamento Compacto Centro',
    endereco: 'Av. Paulista, 2000, São Paulo - SP',
    tipo: 'APARTAMENTO',
    preco: 'R$ 580.000,00',
    status: 'Reservado',
    specs: '65m² • 2 quartos • 1 vagas',
    corretor: 'João Corretor',
    imagem: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80'
  }
];

export default function Imoveis() {
  const { width } = useWindowDimensions();
  
  // Grid responsivo: 3 colunas desktop, 2 tablet, 1 mobile
  const cardWidth = width > 1100 ? '31.5%' : width > 768 ? '48%' : '100%';

  return (
    <S.Container>
      <S.HeaderRow>
        <S.TitleContainer>
          <S.Title>Imóveis</S.Title>
          <S.Subtitle>Gerencie o catálogo de imóveis</S.Subtitle>
        </S.TitleContainer>
        
        <S.AddButton>
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
              <Image 
                source={{ uri: imovel.imagem }} 
                style={{ width: '100%', height: '100%' }} 
                resizeMode="cover" 
              />
              <S.Badge status={imovel.status}>
                <S.BadgeText status={imovel.status}>{imovel.status}</S.BadgeText>
              </S.Badge>
            </S.ImageContainer>

            <S.CardContent>
              <S.PropertyType>{imovel.tipo}</S.PropertyType>
              <S.PropertyTitle numberOfLines={1}>{imovel.titulo}</S.PropertyTitle>
              <S.PropertyAddress numberOfLines={1}>
                {imovel.endereco}
              </S.PropertyAddress>

              <S.SpecItem style={{ marginBottom: 12 }}>{imovel.specs}</S.SpecItem>
              
              <S.PropertyPrice>{imovel.preco}</S.PropertyPrice>
              <S.BrokerText>Corretor: {imovel.corretor}</S.BrokerText>

              <S.ActionRow>
                <S.ViewButton>
                  <Eye size={16} color={theme.colors.text} />
                  <Text style={{ fontSize: 13, fontWeight: '500' }}>Ver</Text>
                </S.ViewButton>
                
                <S.IconButton color={theme.colors.border}>
                  <Pencil size={16} color={theme.colors.text} />
                </S.IconButton>

                <S.IconButton color="#fee2e2">
                  <Trash2 size={16} color={theme.colors.danger} />
                </S.IconButton>
              </S.ActionRow>
            </S.CardContent>
          </S.Card>
        ))}
      </S.PropertyGrid>
    </S.Container>
  );
}