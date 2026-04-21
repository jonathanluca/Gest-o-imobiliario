import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { theme } from '../../../theme';

const isWeb = Platform.OS === 'web';

/* ─── Página ──────────────────────────────────────────────────────────────── */

export const Container = styled.ScrollView`
  flex: 1;
  padding: 24px;
  background-color: ${theme.colors.background};
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
  margin-top: 2px;
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
  color: white;
  font-weight: 600;
  font-size: 14px;
`;

/* ─── Filtros ─────────────────────────────────────────────────────────────── */

export const FilterSection = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-bottom: 28px;
  flex-wrap: wrap;
`;

export const SearchInput = styled.View`
  flex: 1;
  min-width: 250px;
  height: 44px;
  background-color: white;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  flex-direction: row;
  align-items: center;
  padding: 0 12px;
  gap: 8px;
`;

export const SelectInput = styled.View`
  width: ${isWeb ? '200px' : '100%'};
  height: 44px;
  background-color: white;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  justify-content: center;
  padding: 0 12px;
`;

/* ─── Grid de cards ───────────────────────────────────────────────────────── */

export const PropertyGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
  padding-bottom: 48px;
`;

export const Card = styled.View`
  background-color: white;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  overflow: hidden;
`;

export const ImageContainer = styled.View`
  height: 180px;
  background-color: #e2e8f0;
  position: relative;
`;

export const Badge = styled.View<{ status: string }>`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 10px;
  border-radius: 20px;
  background-color: ${(p: any) =>
    p.status === 'Disponível' ? '#dcfce7' :
    p.status === 'Vendido' ? '#fee2e2' : '#fef9c3'};
`;

export const BadgeText = styled.Text<{ status: string }>`
  font-size: 11px;
  font-weight: 700;
  color: ${(p: any) =>
    p.status === 'Disponível' ? '#166534' :
    p.status === 'Vendido' ? '#991b1b' : '#854d0e'};
`;

export const CardContent = styled.View`
  padding: 14px 16px 12px;
`;

export const PropertyType = styled.Text`
  font-size: 10px;
  font-weight: 700;
  color: ${theme.colors.textLight};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`;

export const PropertyTitle = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 2px;
`;

export const PropertyPrice = styled.Text`
  font-size: 17px;
  font-weight: bold;
  color: ${theme.colors.primary};
  margin-bottom: 6px;
`;

export const BrokerText = styled.Text`
  font-size: 12px;
  color: ${theme.colors.textLight};
  margin-bottom: 12px;
`;

export const ActionRow = styled.View`
  flex-direction: row;
  gap: 8px;
  padding-top: 10px;
  border-top-width: 1px;
  border-top-color: ${theme.colors.border};
`;

export const ViewButton = styled.TouchableOpacity`
  flex: 1;
  height: 34px;
  border-radius: 6px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

export const IconButton = styled.TouchableOpacity<{ color: string }>`
  width: 34px;
  height: 34px;
  border-radius: 6px;
  border-width: 1px;
  border-color: ${(p: any) => p.color};
  align-items: center;
  justify-content: center;
`;

/* ─── Modal base ──────────────────────────────────────────────────────────── */

export const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0,0,0,0.45);
  justify-content: center;
  align-items: center;
  padding: ${isWeb ? '32px' : '0px'};
`;

export const ModalContainer = styled.View`
  background-color: white;
  width: ${isWeb ? '600px' : '95%'};
  max-height: ${isWeb ? '88vh' : '92%'};
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
`;

export const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

export const FormScroll = styled.ScrollView`
  flex: 1;
`;

export const FormBody = styled.View`
  padding: 20px 24px;
  gap: 14px;
`;

export const ModalFooter = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 24px;
  border-top-width: 1px;
  border-top-color: ${theme.colors.border};
`;

/* ─── Campos do formulário ────────────────────────────────────────────────── */

export const InputGroup = styled.View``;

export const Label = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${theme.colors.text};
  margin-bottom: 6px;
`;

export const StyledInput = styled.TextInput<{ error?: boolean }>`
  height: 44px;
  border-width: 1.5px;
  border-color: ${(p: any) => p.error ? '#ef4444' : theme.colors.border};
  border-radius: 8px;
  padding: 0 12px;
  font-size: 14px;
  color: ${theme.colors.text};
  background-color: white;
  outline-style: none;
`;

export const StyledTextArea = styled.TextInput`
  min-height: 80px;
  border-width: 1.5px;
  border-color: ${theme.colors.border};
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  color: ${theme.colors.text};
  background-color: white;
  text-align-vertical: top;
  outline-style: none;
`;

export const Row = styled.View`
  flex-direction: row;
  gap: 12px;
`;

export const FlexField = styled.View`
  flex: 1;
`;

export const SelectWrapper = styled.TouchableOpacity`
  height: 44px;
  border-width: 1.5px;
  border-color: ${theme.colors.border};
  border-radius: 8px;
  background-color: white;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
`;

export const SelectText = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
`;

export const DropdownMenu = styled.View`
  border-width: 1px;
  border-color: ${theme.colors.border};
  border-radius: 8px;
  background-color: white;
  margin-top: 4px;
  overflow: hidden;
`;

export const DropdownItem = styled.TouchableOpacity`
  padding: 11px 14px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
`;

export const DropdownItemText = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
`;

export const ErrorText = styled.Text`
  font-size: 12px;
  color: #ef4444;
  margin-top: 3px;
`;

export const ImagePreview = styled.Image`
  width: 100%;
  height: 160px;
  border-radius: 8px;
  margin-top: 8px;
`;

export const ImagePlaceholder = styled.View`
  width: 100%;
  height: 160px;
  border-radius: 8px;
  margin-top: 8px;
  background-color: #f1f5f9;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

export const ImagePlaceholderText = styled.Text`
  font-size: 13px;
  color: ${theme.colors.textLight};
`;

/* ─── Botões do modal ─────────────────────────────────────────────────────── */

export const CancelButton = styled.TouchableOpacity`
  padding: 10px 22px;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  align-items: center;
`;

export const SaveButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  padding: 10px 24px;
  border-radius: 8px;
  background-color: ${(p: any) => p.disabled ? '#94a3b8' : '#0f172a'};
  align-items: center;
  min-width: 100px;
`;

/* ─── Empty / Loading ─────────────────────────────────────────────────────── */

export const EmptyState = styled.View`
  padding: 64px 24px;
  align-items: center;
  gap: 8px;
`;

export const EmptyText = styled.Text`
  font-size: 15px;
  color: ${theme.colors.textLight};
`;
