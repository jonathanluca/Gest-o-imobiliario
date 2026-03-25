import React, { useState, useMemo, useEffect } from 'react';
import { View, useWindowDimensions, ScrollView } from 'react-native';
import { 
  Building2, TrendingUp, FileText, 
  UserPlus, Calendar, DollarSign, Filter 
} from 'lucide-react-native';
import { BarChart, PieChart } from "react-native-gifted-charts";

import { theme } from '../../theme';
import * as S from './dashboard.styles';

// --- 1. TIPAGEM (Sempre fora do componente) ---
interface Venda {
  id: number;
  corretor: string;
  valor: number;
  data: string; 
  tipo: 'Apto' | 'Casa' | 'Terr.' | 'Comer.';
  status: 'Disponível' | 'Reservado' | 'Vendido';
}

interface StatCardProps {
  title: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  width: any;
}

interface TableRowProps {
  name: string;
  sales: string | number;
  value: string;
}

// --- 2. MOCK DE DADOS ---
const MOCK_VENDAS: Venda[] = [
  { id: 1, corretor: "João Corretor", valor: 580000, data: '2026-03-10', tipo: 'Apto', status: 'Vendido' },
  { id: 7, corretor: "João Corretor", valor: 580000, data: '2026-03-10', tipo: 'Terr.', status: 'Vendido' },
  { id: 6, corretor: "João Corretor", valor: 580000, data: '2026-03-10', tipo: 'Casa', status: 'Vendido' },
  { id: 5, corretor: "João Corretor", valor: 580000, data: '2026-03-10', tipo: 'Apto', status: 'Reservado' },
  { id: 4, corretor: "João Corretor", valor: 580000, data: '2026-03-10', tipo: 'Apto', status: 'Vendido' },
  { id: 2, corretor: "Maria Corretora", valor: 192000, data: '2026-03-15', tipo: 'Terr.', status: 'Vendido' },
  { id: 3, corretor: "João Corretor", valor: 29000, data: '2026-02-20', tipo: 'Casa', status: 'Reservado' },
    { id: 8, corretor: "João Corretor", valor: 29000, data: '2026-02-20', tipo: 'Casa', status: 'Reservado' },
    { id: 9, corretor: "João Corretor", valor: 29000, data: '2026-02-20', tipo: 'Casa', status: 'Reservado' },
];

export default function Dashboard() {
  const { width } = useWindowDimensions();
  
    const [hasMounted, setHasMounted] = useState(false);

  // --- 3. ESTADOS DOS FILTROS ---
  const [corretorFiltro, setCorretorFiltro] = useState<string>('Todos');
  const [anoFiltro, setAnoFiltro] = useState<string>('2026');

  // --- 4. LÓGICA DE FILTRAGEM (USEMEMO) ---
  const dadosFiltrados = useMemo(() => {
    return MOCK_VENDAS.filter(item => {
      const matchCorretor = corretorFiltro === 'Todos' || item.corretor === corretorFiltro;
      const matchAno = item.data.includes(anoFiltro);
      return matchCorretor && matchAno;
    });
  }, [corretorFiltro, anoFiltro]);

  // Cálculos baseados nos filtros
  const totalValorVendas = dadosFiltrados.reduce((acc, curr) => acc + curr.valor, 0);
  const totalVendasQtd = dadosFiltrados.length;

  // Dados Dinâmicos para Gráfico de Barras
  const barData = useMemo(() => [
    { value: dadosFiltrados.filter(v => v.tipo === 'Apto').length, label: 'Apto', frontColor: theme.colors.primary },
    { value: dadosFiltrados.filter(v => v.tipo === 'Casa').length, label: 'Casa', frontColor: theme.colors.primary },
    { value: dadosFiltrados.filter(v => v.tipo === 'Terr.').length, label: 'Terr.', frontColor: theme.colors.primary },
    { value: dadosFiltrados.filter(v => v.tipo === 'Comer.').length, label: 'Comer.', frontColor: theme.colors.primary },
  ], [dadosFiltrados]);

  // Dados Dinâmicos para Gráfico de Pizza
  const pieData = useMemo(() => [
    { value: dadosFiltrados.filter(v => v.status === 'Disponível').length, color: theme.colors.success, label: 'Disponível' },
    { value: dadosFiltrados.filter(v => v.status === 'Reservado').length, color: theme.colors.warning, label: 'Reservado' },
    { value: dadosFiltrados.filter(v => v.status === 'Vendido').length, color: theme.colors.primary, label: 'Vendido' },
  ], [dadosFiltrados]);

  
  
  // --- ESTADOS DOS FILTROS ---
  const [corretor, setCorretor] = useState('João Corretor');
  const [ano, setAno] = useState('2026');
  const [mes, setMes] = useState('Todos os meses');

  const cardWidth = width > 1000 ? '31.5%' : width > 700 ? '48%' : '100%';

useEffect(() => {
    setHasMounted(true);
  }, []);
  

  return (
    <S.Container>
      <S.Content>
        <S.Title>Dashboard</S.Title>
        <S.Subtitle>Visão geral do sistema</S.Subtitle>

        {/* --- SEÇÃO DE FILTROS --- */}
        <S.FilterCard>
          <S.FilterHeader>
            <Filter color={theme.colors.primary} size={18} />
            <S.FilterTitle>Filtros de Análise</S.FilterTitle>
          </S.FilterHeader>

          <S.FilterRow>
            <View style={{ flex: 1, minWidth: 150 }}>
              <S.CardTitle style={{ marginBottom: 8 }}>Corretor</S.CardTitle>
              {/* Aqui entraria seu componente de Select. Exemplo visual: */}
              <S.MockInput><S.TableText>{corretor}</S.TableText></S.MockInput>
            </View>

            <View style={{ flex: 1, minWidth: 150 }}>
              <S.CardTitle style={{ marginBottom: 8 }}>Ano</S.CardTitle>
              <S.MockInput><S.TableText>{ano}</S.TableText></S.MockInput>
            </View>

            <View style={{ flex: 1, minWidth: 150 }}>
              <S.CardTitle style={{ marginBottom: 8 }}>Mês</S.CardTitle>
              <S.MockInput><S.TableText>{mes}</S.TableText></S.MockInput>
            </View>
          </S.FilterRow>

          <S.ActiveFilterBar>
            <S.ActiveFilterText>
              Filtros ativos: <S.ActiveFilterBoldText>Corretor: {corretor} •</S.ActiveFilterBoldText>
            </S.ActiveFilterText>
          </S.ActiveFilterBar>
        </S.FilterCard>


      {/* --- GRID DE CARDS (6 CARDS) --- */}
        <S.StatsGrid>
          <StatCard 
            width={cardWidth} title="Imóveis Disponíveis" value="2" sub="Ativos no sistema" 
            icon={<Building2 color="#3b82f6" size={20}/>} 
          />
          <StatCard 
            width={cardWidth} title="Vendas no Mês" value="1" sub="R$ 580.000,00" 
            icon={<TrendingUp color="#10b981" size={20}/>} 
          />
          <StatCard 
            width={cardWidth} title="Propostas Pendentes" value="2" sub="Aguardando resposta" 
            icon={<FileText color="#f59e0b" size={20}/>} 
          />
          <StatCard 
            width={cardWidth} title="Leads Ativos" value="3" sub="Em processo" 
            icon={<UserPlus color="#a855f7" size={20}/>} 
          />
          <StatCard 
            width={cardWidth} title="Visitas Agendadas" value="2" sub="Próximas visitas" 
            icon={<Calendar color="#ef4444" size={20}/>} 
          />
          <StatCard 
            width={cardWidth} title="Total em Vendas" value="R$ 580.000,00" sub="Mês atual" 
            icon={<DollarSign color="#10b981" size={20}/>} 
          />
        </S.StatsGrid>

      
      
      
      {/* SEÇÃO DE GRÁFICOS */}
      <S.ChartsRow style={{ flexDirection: width > 900 ? 'row' : 'column' }}>
        <S.ChartCard style={{ width: width > 900 ? '49%' : '100%' }}>
          <S.CardTitle>Imóveis por Tipo</S.CardTitle>
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <BarChart
              data={barData}
              barWidth={40}
              noOfSections={3}
              barBorderRadius={4}
              yAxisThickness={0}
              xAxisColor={theme.colors.border}
              hideRules
            />
          </View>
        </S.ChartCard>

        <S.ChartCard style={{ width: width > 900 ? '49%' : '100%' }}>
          <S.CardTitle>Status dos Imóveis</S.CardTitle>
          <View style={{ alignItems: 'center', marginTop: 20, flexDirection: 'row', justifyContent: 'space-around' }}>
            <PieChart
              data={pieData}
              donut
              radius={70}
              innerRadius={45}
              showText
              textColor="white"
            />
            <View>
              {pieData.map((item, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: item.color, marginRight: 8 }} />
                  <S.CardSubValue>{item.label}: {item.value}</S.CardSubValue>
                </View>
              ))}
            </View>
          </View>
        </S.ChartCard>
      </S.ChartsRow>

      {/* TABELA DE COMISSÕES DINÂMICA */}
      <S.TableCard>
        <S.CardTitle style={{ marginBottom: 20 }}>Comissões por Corretor</S.CardTitle>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1, minWidth: 500 }}>
            <S.TableHeader style={{ flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#eee' }}>
              <S.HeaderText style={{ flex: 3 }}>CORRETOR</S.HeaderText>
              <S.HeaderText style={{ flex: 1, textAlign: 'center' }}>VENDAS</S.HeaderText>
              <S.HeaderText style={{ flex: 2, textAlign: 'right' }}>TOTAL COMISSÃO</S.HeaderText>
            </S.TableHeader>
            
            {/* Mapeando os dados filtrados para a tabela */}
            {/* Aqui você pode agrupar os dados se quiser somar as vendas do mesmo corretor */}
            {dadosFiltrados.map((venda) => (
              <TableRow 
                key={venda.id}
                name={venda.corretor} 
                sales={1} 
                value={`R$ ${(venda.valor * 0.05).toLocaleString('pt-BR')}`} // Exemplo 5%
              />
            ))}
          </View>
        </ScrollView>
      </S.TableCard>
      </S.Content>
    </S.Container>
      
   
  );
}

// --- 5. COMPONENTES AUXILIARES (Fora do Dashboard) ---
function StatCard({ title, value, sub, icon, width }: StatCardProps) {
  return (
    <S.Card style={{ width: width }}>
      <S.CardHeader>
        <S.CardTitle>{title}</S.CardTitle>
        {icon}
      </S.CardHeader>
      <S.CardValue>{value}</S.CardValue>
      <S.CardSubValue>{sub}</S.CardSubValue>
    </S.Card>
  );
}

function TableRow({ name, sales, value }: TableRowProps) {
  return (
    <S.TableRow>
      <S.TableText style={{ flex: 3, fontWeight: '500' }}>{name}</S.TableText>
      <S.TableText style={{ flex: 1, textAlign: 'center' }}>{sales}</S.TableText>
      <S.TableText style={{ flex: 2, textAlign: 'right', color: theme.colors.success, fontWeight: 'bold' }}>{value}</S.TableText>
    </S.TableRow>
  );
}