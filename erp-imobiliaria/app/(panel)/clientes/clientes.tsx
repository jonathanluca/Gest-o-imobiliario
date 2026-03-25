import React from 'react';
import { View, Text, TextInput, ScrollView, useWindowDimensions, TouchableOpacity } from 'react-native';
import { Plus, Search, ChevronDown, User, Pencil, Trash2 } from 'lucide-react-native';
import { theme } from '../../../theme';
import * as S from './clientes.styles';

const clientesMock = [
  { id: 1, nome: 'Carlos Comprador', obs: 'Interessado em imóveis de alto...', email: 'carlos@email.com', tel: '(11) 91111-1111', cpf: '123.456.789-00', tipo: 'Comprador', data: '19/01/2026' },
  { id: 2, nome: 'Fernanda Silva', obs: 'Primeiro imóvel, financiamento...', email: 'fernanda@email.com', tel: '(11) 92222-2222', cpf: '234.567.890-11', tipo: 'Comprador', data: '04/02/2026' },
  { id: 3, nome: 'Roberto Vendedor', obs: 'Quer vender casa no interior', email: 'roberto@email.com', tel: '(11) 93333-3333', cpf: '345.678.901-22', tipo: 'Vendedor', data: '14/02/2026' },
  { id: 4, nome: 'Juliana Investidora', obs: 'Investidora, compra e vende...', email: 'juliana@email.com', tel: '(11) 94444-4444', cpf: '456.789.012-33', tipo: 'Comprador/Vendedor', data: '09/01/2026' },
  { id: 5, nome: 'Pedro Santos', obs: 'Procura apartamento até 600k', email: 'pedro@email.com', tel: '(11) 95555-5555', cpf: '567.890.123-44', tipo: 'Comprador', data: '28/02/2026' },
];

export default function Clientes() {
  const { width } = useWindowDimensions();
  const isMobile = width < 800;

  return (
    <S.Container>
      <S.HeaderRow>
        <S.TitleContainer>
          <S.Title>Clientes</S.Title>
          <S.Subtitle>Gerencie sua carteira de clientes</S.Subtitle>
        </S.TitleContainer>
        
        <S.AddButton>
          <Plus size={20} color="white" />
          <Text style={{ color: 'white', fontWeight: '600' }}>Novo Cliente</Text>
        </S.AddButton>
      </S.HeaderRow>

      <S.FilterSection>
        <S.SearchInput>
          <Search size={18} color={theme.colors.textLight} />
          <TextInput 
            placeholder="Buscar por nome, email ou CPF..." 
            style={{ flex: 1, marginLeft: 10, outlineStyle: 'none' } as any}
          />
        </S.SearchInput>

        <S.SelectInput>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: theme.colors.textLight }}>Todos os tipos</Text>
            <ChevronDown size={18} color={theme.colors.textLight} />
          </View>
        </S.SelectInput>
      </S.FilterSection>

      <ScrollView horizontal={isMobile} showsHorizontalScrollIndicator={false}>
        <S.TableContainer style={{ minWidth: isMobile ? 900 : '100%' }}>
          {/* HEADERS */}
          <S.TableHeader>
            <S.HeaderText style={{ flex: 3 }}>Cliente</S.HeaderText>
            <S.HeaderText style={{ flex: 2 }}>Contato</S.HeaderText>
            <S.HeaderText style={{ flex: 1.5 }}>CPF</S.HeaderText>
            <S.HeaderText style={{ flex: 1.5 }}>Tipo</S.HeaderText>
            <S.HeaderText style={{ flex: 1.2 }}>Cadastro</S.HeaderText>
            <S.HeaderText style={{ flex: 1, textAlign: 'right' }}>Ações</S.HeaderText>
          </S.TableHeader>

          {/* ROWS */}
          {clientesMock.map((item) => (
            <S.TableRow key={item.id}>
              {/* Cliente */}
              <View style={{ flex: 3 }}>
                <S.ClientInfo>
                  <S.Avatar><User size={18} color={theme.colors.primary} /></S.Avatar>
                  <View>
                    <S.ClientName>{item.nome}</S.ClientName>
                    <S.ClientObs numberOfLines={1}>{item.obs}</S.ClientObs>
                  </View>
                </S.ClientInfo>
              </View>

              {/* Contato */}
              <View style={{ flex: 2 }}>
                <S.ContactEmail>{item.email}</S.ContactEmail>
                <S.ContactPhone>{item.tel}</S.ContactPhone>
              </View>

              {/* CPF */}
              <Text style={{ flex: 1.5, fontSize: 13 }}>{item.cpf}</Text>

              {/* Tipo */}
              <View style={{ flex: 1.5 }}>
                <S.TypeBadge type={item.tipo}>
                  <S.TypeText type={item.tipo}>{item.tipo}</S.TypeText>
                </S.TypeBadge>
              </View>

              {/* Data */}
              <Text style={{ flex: 1.2, fontSize: 13, color: theme.colors.textLight }}>{item.data}</Text>

              {/* Ações */}
              <S.ActionButtons style={{ flex: 1, justifyContent: 'flex-end' }}>
                <S.IconButton><Pencil size={16} color={theme.colors.text} /></S.IconButton>
                <S.IconButton variant="danger"><Trash2 size={16} color={theme.colors.danger} /></S.IconButton>
              </S.ActionButtons>
            </S.TableRow>
          ))}
        </S.TableContainer>
      </ScrollView>

      <S.FooterText>Total: {clientesMock.length} cliente(s)</S.FooterText>
    </S.Container>
  );
}