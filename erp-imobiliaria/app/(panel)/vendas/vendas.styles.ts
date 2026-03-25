import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { theme } from '../../../theme';

export const Container = styled.ScrollView`
  flex: 1;
  padding: 24px;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

export const Subtitle = styled.Text`
  font-size: 14px;
  color: ${theme.colors.textLight};
`;

/* Cards de Resumo */
export const StatsRow = styled.View`
  flex-direction: row;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

export const SummaryCard = styled.View`
  background-color: ${theme.colors.white};
  padding: 20px;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  flex: 1;
  min-width: ${Platform.OS === 'web' ? '250px' : '100%'};
`;

export const CardHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const CardLabel = styled.Text`
  font-size: 13px;
  color: ${theme.colors.textLight};
  font-weight: 500;
`;

export const CardValue = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

/* Filtros */
export const FilterSection = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

/* Tabela */
export const TableContainer = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  margin-bottom: 50px;
`;

export const TableHeader = styled.View`
  flex-direction: row;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
  background-color: #fafafa;
`;

export const HeaderText = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: ${theme.colors.textLight};
`;

export const TableRow = styled.View`
  flex-direction: row;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
  align-items: center;
`;

/* Células */
export const PropertyInfo = styled.View`
  flex: 2;
`;

export const PropertyName = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

export const PropertyLocation = styled.Text`
  font-size: 11px;
  color: ${theme.colors.textLight};
`;

export const TextCell = styled.Text`
  font-size: 13px;
  color: ${theme.colors.text};
`;

export const CommissionValue = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${theme.colors.success};
`;

export const CommissionPercent = styled.Text`
  font-size: 11px;
  color: ${theme.colors.textLight};
`;

/* Status Badges */
export const StatusBadge = styled.View<{ status: string }>`
  flex-direction: row;
  align-items: center;
  padding: 4px 10px;
  border-radius: 20px;
  gap: 4px;
  background-color: ${(props: any) => 
    props.status === 'Concluída' ? '#dcfce7' : '#dbeafe'};
`;

export const StatusText = styled.Text<{ status: string }>`
  font-size: 11px;
  font-weight: 600;
  color: ${(props: any) => 
    props.status === 'Concluída' ? '#166534' : '#1e40af'};
`;