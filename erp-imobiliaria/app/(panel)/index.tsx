import React from 'react';
import { View, useWindowDimensions, ScrollView } from 'react-native';
import { Building2, TrendingUp, FileText, UserPlus, Calendar, DollarSign } from 'lucide-react-native';
// Importando os gráficos
import { BarChart, PieChart } from "react-native-gifted-charts";

import { theme } from '../../theme';
import * as S from './dashboard.styles';

export default function Dashboard() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const cardWidth = width > 1000 ? '31.5%' : width > 700 ? '48%' : '100%';

  // Dados para o Gráfico de Barras (Imóveis por Tipo)
  const barData = [
    { value: 3, label: 'Apto', frontColor: theme.colors.primary },
    { value: 1, label: 'Casa', frontColor: theme.colors.primary },
    { value: 1, label: 'Terr.', frontColor: theme.colors.primary },
    { value: 1, label: 'Comer.', frontColor: theme.colors.primary },
  ];




  // Dados para o Gráfico de Pizza (Status)
  const pieData = [
    { value: 4, color: theme.colors.success, text: '4', label: 'Disponível' },
    { value: 1, color: theme.colors.warning, text: '1', label: 'Reservado' },
    { value: 1, color: theme.colors.primary, text: '1', label: 'Vendido' },
  ];

  return (
    <S.Container>
      <S.Title>Dashboard</S.Title>
      <S.Subtitle>Visão geral do sistema</S.Subtitle>

      {/* CARDS DE STATUS */}
      <S.StatsGrid>
        <StatCard width={cardWidth} title="Imóveis Disponíveis" value="4" sub="Ativos no sistema" icon={<Building2 color={theme.colors.primary} size={20}/>} />
        <StatCard width={cardWidth} title="Vendas no Mês" value="2" sub="R$ 3.780.000,00" icon={<TrendingUp color={theme.colors.success} size={20}/>} />
        <StatCard width={cardWidth} title="Propostas Pendentes" value="2" sub="Aguardando resposta" icon={<FileText color={theme.colors.warning} size={20}/>} />
      </S.StatsGrid>

      {/* SEÇÃO DE GRÁFICOS */}
      <S.ChartsRow style={{ flexDirection: width > 900 ? 'row' : 'column' }}>
        
        {/* GRÁFICO DE BARRAS */}
        <S.ChartCard style={{ width: width > 900 ? '49%' : '100%' }}>
          <S.CardTitle>Imóveis por Tipo</S.CardTitle>
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <BarChart
              data={barData}
              barWidth={40}
              noOfSections={3}
              dashGap={0}
               barBorderRadius={4}
              yAxisThickness={0}
              xAxisThickness={1}
              xAxisColor={theme.colors.border}
              hideRules
              yAxisLabelContainerStyle={{ width: 30 }}
              isAnimated
            />
          </View>
        </S.ChartCard>

        {/* GRÁFICO DE PIZZA / DONUT */}
        <S.ChartCard style={{ width: width > 900 ? '49%' : '100%' }}>
          <S.CardTitle>Status dos Imóveis</S.CardTitle>
          <View style={{ alignItems: 'center', marginTop: 20, flexDirection: 'row', justifyContent: 'space-around' }}>
            <PieChart
              data={pieData}
              donut
              radius={80}
              innerRadius={50}
              showText
              textColor="white"
              textSize={12}
              focusOnPress
            />
            {/* Legenda Lateral */}
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

      {/* TABELA DE COMISSÕES */}
      <S.TableCard>
        <S.CardTitle style={{ marginBottom: 20 }}>Comissões por Corretor</S.CardTitle>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ width: width < 600 ? 500 : '100%' }}>
            <S.TableHeader>
              <S.HeaderText style={{ flex: 2 }}>Corretor</S.HeaderText>
              <S.HeaderText style={{ flex: 1, textAlign: 'center' }}>Vendas</S.HeaderText>
              <S.HeaderText style={{ flex: 1, textAlign: 'right' }}>Total Comissão</S.HeaderText>
            </S.TableHeader>
            
            <TableRow name="João Corretor" sales="1" value="R$ 29.000,00" />
            <TableRow name="Maria Corretora" sales="1" value="R$ 192.000,00" />
          </View>
        </ScrollView>
      </S.TableCard>

    </S.Container>
  );
}

// Componentes auxiliares
function StatCard({ title, value, sub, icon, width }: any) {
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

function TableRow({ name, sales, value }: any) {
  return (
    <S.TableRow>
      <S.TableText style={{ flex: 2, fontWeight: '500' }}>{name}</S.TableText>
      <S.TableText style={{ flex: 1, textAlign: 'center' }}>{sales}</S.TableText>
      <S.TableText style={{ flex: 1, textAlign: 'right', color: theme.colors.success, fontWeight: 'bold' }}>{value}</S.TableText>
    </S.TableRow>
  );
}