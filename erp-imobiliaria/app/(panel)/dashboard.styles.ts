import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { theme } from '../../theme';

export const Container = styled.ScrollView`
  flex: 1;
  padding: 24px;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

export const Subtitle = styled.Text`
  font-size: 14px;
  color: ${theme.colors.textLight};
  margin-bottom: 30px;
`;

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
  width: ${Platform.OS === 'web' ? 'calc(33.33% - 11px)' : '100%'};
`;

export const CardHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
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

export const ChartsRow = styled.View`
  flex-direction: row;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

export const ChartCard = styled(Card)`
  width: ${Platform.OS === 'web' ? 'calc(50% - 8px)' : '100%'};
`;

export const TableCard = styled(Card)`
  width: 100%;
  margin-bottom: 50px;
`;

export const TableHeader = styled.View`
  flex-direction: row;
  padding-bottom: 12px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
`;

export const HeaderText = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: ${theme.colors.textLight};
  text-transform: uppercase;
`;

export const TableRow = styled.View`
  flex-direction: row;
  padding: 16px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.background};
`;

export const TableText = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
`;