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
  height: 45px;
  background-color: white;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  flex-direction: row;
  align-items: center;
  padding: 0 12px;
`;

/* ─── Tabela ──────────────────────────────────────────────────────────────── */

export const TableContainer = styled.View`
  background-color: white;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  overflow: hidden;
  margin-bottom: 20px;
`;

export const TableHeader = styled.View`
  flex-direction: row;
  background-color: #fafafa;
  padding: 14px 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
`;

export const HeaderText = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: ${theme.colors.text};
`;

export const TableRow = styled.View`
  flex-direction: row;
  padding: 14px 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
  align-items: center;
`;

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
  margin-top: 1px;
`;

export const ContactEmail = styled.Text`
  font-size: 13px;
  color: ${theme.colors.text};
`;

export const ContactPhone = styled.Text`
  font-size: 12px;
  color: ${theme.colors.textLight};
  margin-top: 1px;
`;

export const TypeBadge = styled.View<{ type: string }>`
  padding: 4px 10px;
  border-radius: 6px;
  align-self: flex-start;
  background-color: ${(p: any) =>
    p.type === 'Comprador' ? '#dcfce7' :
    p.type === 'Vendedor' ? '#dbeafe' :
    p.type === 'Locatário' ? '#fef9c3' :
    p.type === 'Proprietário' ? '#fce7f3' : '#f3e8ff'};
`;

export const TypeText = styled.Text<{ type: string }>`
  font-size: 11px;
  font-weight: 700;
  color: ${(p: any) =>
    p.type === 'Comprador' ? '#166534' :
    p.type === 'Vendedor' ? '#1e40af' :
    p.type === 'Locatário' ? '#854d0e' :
    p.type === 'Proprietário' ? '#9d174d' : '#6b21a8'};
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
  border-color: ${(p: any) => p.variant === 'danger' ? '#fee2e2' : theme.colors.border};
  align-items: center;
  justify-content: center;
`;

export const FooterText = styled.Text`
  font-size: 14px;
  color: ${theme.colors.textLight};
  margin-bottom: 40px;
`;

/* ─── Dropdown do filtro ──────────────────────────────────────────────────── */

export const DropdownMenu = styled.View`
  position: absolute;
  top: 48px;
  left: 0;
  right: 0;
  border-width: 1px;
  border-color: ${theme.colors.border};
  border-radius: 8px;
  background-color: white;
  z-index: 100;
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

/* ─── Modal ───────────────────────────────────────────────────────────────── */

export const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0,0,0,0.45);
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

export const ModalBox = styled.ScrollView`
  background-color: white;
  border-radius: 14px;
  width: 100%;
  max-width: ${isWeb ? '560px' : '100%'};
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

/* ─── Campos ──────────────────────────────────────────────────────────────── */

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

export const ErrorText = styled.Text`
  font-size: 12px;
  color: #ef4444;
  margin-top: 3px;
`;

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
  min-width: 120px;
`;
