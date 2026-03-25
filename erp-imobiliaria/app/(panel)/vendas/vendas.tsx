import React from 'react';
import { View, Text, TextInput, ScrollView, useWindowDimensions, TouchableOpacity } from 'react-native';
import { DollarSign, Search, ChevronDown, CheckCircle2, Clock, Plus } from 'lucide-react-native';
import { theme } from '../../../theme';
import * as S from './vendas.styles';

const vendasMock = [
  {
    id: 1,
    imovel: 'Cobertura Duplex Premium',
    local: 'São Paulo - SP',
    comprador: 'Carlos Comprador',
    corretor: 'Maria Corretora',
    valor: 'R$ 3.200.000,00',
    comissao: 'R$ 192.000,00',
    porcentagem: '6.0%',
    status: 'Concluída',
    data: '04/03/2026'
  },
  {
    id: 2,
    imovel: 'Apartamento Compacto Centro',
    local: 'São Paulo - SP',
    comprador: 'Pedro Santos',
    corretor: 'João Corretor',
    valor: 'R$ 580.000,00',
    comissao: 'R$ 29.000,00',
    porcentagem: '5.0%',
    status: 'Em Negociação',
    data: '07/03/2026'
  }
];

export default function Vendas() {
  const { width } = useWindowDimensions();
  const isMobile = width < 800;

  return (
    <S.Container>
      <S.HeaderRow>
        <View>
          <S.Title>Vendas</S.Title>
          <S.Subtitle>Gerencie as vendas realizadas</S.Subtitle>
        </View>
        <TouchableOpacity style={{ backgroundColor: '#0f172a', padding: 12, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Plus size={18} color="white" />
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Registrar Venda</Text>
        </TouchableOpacity>
      </S.HeaderRow>

      {/* CARDS DE RESUMO */}
      <S.StatsRow>
        <SummaryStat label="Total de Vendas" value="2" icon={<DollarSign color={theme.colors.success} />} />
        <SummaryStat label="Valor Total" value="R$ 3.780.000,00" icon={<DollarSign color={theme.colors.primary} />} />
        <SummaryStat label="Total Comissões" value="R$ 221.000,00" icon={<DollarSign color="#a855f7" />} />
      </S.StatsRow>

      {/* FILTROS */}
      <S.FilterSection>
        <View style={{ flex: 1, minWidth: 250, height: 45, backgroundColor: 'white', borderRadius: 8, borderWidth: 1, borderColor: theme.colors.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 }}>
          <Search size={18} color={theme.colors.textLight} />
          <TextInput placeholder="Buscar por imóvel, comprador ou corretor..." style={{ flex: 1, marginLeft: 10, outlineStyle: 'none' } as any} />
        </View>
        <View style={{ width: isMobile ? '100%' : 200, height: 45, backgroundColor: 'white', borderRadius: 8, borderWidth: 1, borderColor: theme.colors.border, justifyContent: 'center', paddingHorizontal: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: theme.colors.textLight }}>Todos os status</Text>
            <ChevronDown size={18} color={theme.colors.textLight} />
          </View>
        </View>
      </S.FilterSection>

      {/* TABELA DE VENDAS */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <S.TableContainer style={{ minWidth: 1000 }}>
          <S.TableHeader>
            <S.HeaderText style={{ flex: 2 }}>Imóvel</S.HeaderText>
            <S.HeaderText style={{ flex: 1.2 }}>Comprador</S.HeaderText>
            <S.HeaderText style={{ flex: 1.2 }}>Corretor</S.HeaderText>
            <S.HeaderText style={{ flex: 1.2 }}>Valor</S.HeaderText>
            <S.HeaderText style={{ flex: 1.2 }}>Comissão</S.HeaderText>
            <S.HeaderText style={{ flex: 1.2 }}>Status</S.HeaderText>
            <S.HeaderText style={{ flex: 1 }}>Data</S.HeaderText>
          </S.TableHeader>

          {vendasMock.map((venda) => (
            <S.TableRow key={venda.id}>
              <S.PropertyInfo>
                <S.PropertyName>{venda.imovel}</S.PropertyName>
                <S.PropertyLocation>{venda.local}</S.PropertyLocation>
              </S.PropertyInfo>

              <View style={{ flex: 1.2 }}><S.TextCell>{venda.comprador}</S.TextCell></View>
              <View style={{ flex: 1.2 }}><S.TextCell>{venda.corretor}</S.TextCell></View>
              <View style={{ flex: 1.2 }}><S.TextCell style={{ fontWeight: 'bold' }}>{venda.valor}</S.TextCell></View>
              
              <View style={{ flex: 1.2 }}>
                <S.CommissionValue>{venda.comissao}</S.CommissionValue>
                <S.CommissionPercent>{venda.porcentagem}</S.CommissionPercent>
              </View>

              <View style={{ flex: 1.2 }}>
                <S.StatusBadge status={venda.status}>
                  {venda.status === 'Concluída' ? <CheckCircle2 size={12} color="#166534" /> : <Clock size={12} color="#1e40af" />}
                  <S.StatusText status={venda.status}>{venda.status}</S.StatusText>
                </S.StatusBadge>
              </View>

              <View style={{ flex: 1 }}><S.TextCell style={{ color: theme.colors.textLight }}>{venda.data}</S.TextCell></View>
            </S.TableRow>
          ))}
        </S.TableContainer>
      </ScrollView>
    </S.Container>
  );
}

function SummaryStat({ label, value, icon }: any) {
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