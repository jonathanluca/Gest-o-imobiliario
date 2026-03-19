import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { theme } from '../../theme';

interface StatusProps {
  color: string;
}

export const Container = styled.ScrollView`
  flex: 1;
  background-color: ${theme.colors.background};
`;

export const Content = styled.View`
  padding: 24px;
  /* No desktop, limita a largura para não esticar demais */
  max-width: 1400px;
  width: 100%;
  align-self: center;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

export const Subtitle = styled.Text`
  font-size: 14px;
  color: ${theme.colors.textLight};
  margin-bottom: 24px;
`;

/* --- SEÇÃO DE FILTROS --- */
export const FilterCard = styled.View`
  background-color: #f0f7ff; /* Azul bem claro conforme o print */
  border-width: 1px;
  border-color: #dbeafe;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
`;

export const FilterHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
  gap: 8px;
`;

export const FilterTitle = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.primary};
`;

export const FilterRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
`;

export const ActiveFiltersInfo = styled.Text`
  font-size: 12px;
  color: ${theme.colors.primary};
  background-color: #e0efff;
  padding: 4px 12px;
  border-radius: 4px;
  margin-top: 12px;
  font-weight: 500;
`;

/* --- CARDS DE ESTATÍSTICAS --- */
export const StatsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
`;

export const Card = styled.View`
  background-color: ${theme.colors.white};
  padding: 20px;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  /* Sombra leve para profundidade */
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05;
  shadow-radius: 4px;
`;

export const CardHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

export const CardTitle = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.textLight};
`;

export const CardValue = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

export const CardSubValue = styled.Text`
  font-size: 12px;
  color: ${theme.colors.textLight};
  margin-top: 4px;
`;

/* --- GRÁFICOS --- */
export const ChartsRow = styled.View`
  flex-direction: row;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

export const ChartCard = styled(Card)`
  /* Ocupa 100% no mobile e se ajusta no desktop via props inline no componente */
  min-height: 300px;
`;

/* --- TABELA --- */
export const TableCard = styled(Card)`
  width: 100%;
  margin-bottom: 50px;
  padding: 20px 0px; /* Padding vertical apenas para o conteúdo interno respirar */
`;

// Ajuste específico para o título dentro do card da tabela
export const TableTitle = styled(CardTitle)`
  padding-horizontal: 20px;
  margin-bottom: 20px;
`;

export const TableHeader = styled.View`
  flex-direction: row;
  padding: 0 20px 12px 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
`;

export const HeaderText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: ${theme.colors.textLight};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const TableRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 16px 20px;
  border-bottom-width: 1px;
  border-bottom-color: #f8f9fa;
`;

export const TableText = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
`;

export const StatusBadge = styled.View<{ color: string }>`
  background-color: ${(props:StatusProps) => props.color + '20'}; /* 20% de opacidade */
  padding: 4px 8px;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
`;

export const StatusText = styled.Text<{ color: string }>`
  color: ${(props:StatusProps) => props.color};
  font-size: 11px;
  font-weight: bold;
  text-transform: uppercase;
`;

export const MockInput = styled.View`
  background-color: white;
  border-width: 1px;
  border-color: #e2e8f0;
  border-radius: 8px;
  padding: 10px 15px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ActiveFilterBar = styled.View`
  background-color: #dbeafe;
  padding: 10px 15px;
  border-radius: 8px;
  margin-top: 20px;
  border-width: 1px;
  border-color: #bfdbfe;
`;

export const ActiveFilterText = styled.Text`
  font-size: 13px;
  color: ${theme.colors.primary};
`;

export const ActiveFilterBoldText = styled.Text`
  font-weight: bold;
`;

