import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { theme } from '../../../theme';

interface StatusProps {
  color: string;
  variant:string;
}

export const Container = styled.ScrollView`
  flex: 1;
  padding: 24px;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

export const TitleContainer = styled.View``;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

export const Subtitle = styled.Text`
  font-size: 14px;
  color: ${theme.colors.textLight};
`;

export const AddButton = styled.TouchableOpacity`
  background-color: #0f172a;
  padding: 10px 20px;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

/* Filtros */
export const FilterSection = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

export const SearchInput = styled.View`
  flex: 1;
  min-width: 250px;
  height: 45px;
  background-color: ${theme.colors.white};
  border-radius: 8px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  flex-direction: row;
  align-items: center;
  padding: 0 12px;
`;

export const SelectInput = styled.View`
  width: ${Platform.OS === 'web' ? '250px' : '100%'};
  height: 45px;
  background-color: ${theme.colors.white};
  border-radius: 8px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  justify-content: center;
  padding: 0 12px;
`;

/* Tabela */
export const TableContainer = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  overflow: hidden;
  margin-bottom: 20px;
`;

export const TableHeader = styled.View`
  flex-direction: row;
  background-color: #fafafa;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
`;

export const HeaderText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

export const TableRow = styled.View`
  flex-direction: row;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
  align-items: center;
`;

/* Células da Tabela */
export const ClientInfo = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

export const Avatar = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: #dbeafe;
  align-items: center;
  justify-content: center;
`;

export const ClientName = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.text};
`;

export const ClientObs = styled.Text`
  font-size: 12px;
  color: ${theme.colors.textLight};
`;

export const ContactEmail = styled.Text`
  font-size: 13px;
  color: ${theme.colors.text};
`;

export const ContactPhone = styled.Text`
  font-size: 12px;
  color: ${theme.colors.textLight};
`;

/* Badges de Tipo */
export const TypeBadge = styled.View<{ type: string }>`
  padding: 4px 10px;
  border-radius: 6px;
  align-self: flex-start;
  background-color: ${(props: any) => 
    props.type === 'Comprador' ? '#dcfce7' : 
    props.type === 'Vendedor' ? '#dbeafe' : '#f3e8ff'};
`;

export const TypeText = styled.Text<{ type: string }>`
  font-size: 11px;
  font-weight: 600;
  color: ${(props: any) => 
    props.type === 'Comprador' ? '#166534' : 
    props.type === 'Vendedor' ? '#1e40af' : '#6b21a8'};
`;

export const ActionButtons = styled.View`
  flex-direction: row;
  gap: 8px;
`;

export const IconButton = styled.TouchableOpacity<{ variant?: 'danger' }>`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border-width: 1px;
  border-color: ${(props:StatusProps) => props.variant === 'danger' ? '#fee2e2' : theme.colors.border};
  align-items: center;
  justify-content: center;
`;

export const FooterText = styled.Text`
  font-size: 14px;
  color: ${theme.colors.textLight};
  margin-bottom: 40px;
`;