import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { theme } from '../../../theme';

interface StatusProps {
  color: string;
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

export const AddButtonText = styled.Text`
  color: ${theme.colors.white};
  font-weight: 600;
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
  width: ${Platform.OS === 'web' ? '200px' : '100%'};
  height: 45px;
  background-color: ${theme.colors.white};
  border-radius: 8px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  justify-content: center;
  padding: 0 12px;
`;

/* Grid de Imóveis */
export const PropertyGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 50px;
`;

/* Card de Imóvel */
export const Card = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  overflow: hidden;
  /* Largura dinâmica via prop style no componente */
`;

export const ImageContainer = styled.View`
  height: 180px;
  background-color: #eee;
  position: relative;
`;

export const Badge = styled.View<{ status: string }>`
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  background-color: ${(props: any) => 
    props.status === 'Disponível' ? '#dcfce7' : 
    props.status === 'Vendido' ? '#fee2e2' : '#fef9c3'};
`;

export const BadgeText = styled.Text<{ status: string }>`
  font-size: 11px;
  font-weight: bold;
  color: ${(props: any) => 
    props.status === 'Disponível' ? '#166534' : 
    props.status === 'Vendido' ? '#991b1b' : '#854d0e'};
`;

export const CardContent = styled.View`
  padding: 16px;
`;

export const PropertyType = styled.Text`
  font-size: 10px;
  font-weight: bold;
  color: ${theme.colors.textLight};
  text-transform: uppercase;
  margin-bottom: 4px;
`;

export const PropertyTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 4px;
`;

export const PropertyAddress = styled.Text`
  font-size: 12px;
  color: ${theme.colors.textLight};
  margin-bottom: 12px;
`;

export const SpecsRow = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-bottom: 16px;
`;

export const SpecItem = styled.Text`
  font-size: 12px;
  color: ${theme.colors.textLight};
`;

export const PropertyPrice = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.primary};
  margin-bottom: 4px;
`;

export const BrokerText = styled.Text`
  font-size: 11px;
  color: ${theme.colors.textLight};
  margin-bottom: 16px;
`;

/* Ações do Card */
export const ActionRow = styled.View`
  flex-direction: row;
  gap: 8px;
  padding-top: 12px;
  border-top-width: 1px;
  border-top-color: ${theme.colors.border};
`;

export const ViewButton = styled.TouchableOpacity`
  flex: 1;
  height: 35px;
  border-radius: 6px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

export const IconButton = styled.TouchableOpacity<{ color: string }>`
  width: 35px;
  height: 35px;
  border-radius: 6px;
  border-width: 1px;
  border-color: ${(props:StatusProps) => props.color};
  align-items: center;
  justify-content: center;
`;