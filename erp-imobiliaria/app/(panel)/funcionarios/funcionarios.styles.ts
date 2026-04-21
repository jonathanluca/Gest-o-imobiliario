import styled from 'styled-components/native';
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
  color: white;
  font-weight: 600;
`;

export const SearchRow = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

export const SearchBox = styled.View`
  flex: 1;
  min-width: 220px;
  flex-direction: row;
  align-items: center;
  background-color: white;
  border-width: 1px;
  border-color: ${theme.colors.border};
  border-radius: 8px;
  padding: 0 12px;
  height: 42px;
  gap: 8px;
`;

export const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 14px;
  color: ${theme.colors.text};
  outline-style: none;
`;

export const TableHeader = styled.View`
  flex-direction: row;
  background-color: #f8fafc;
  border-radius: 8px 8px 0 0;
  padding: 12px 16px;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

export const TableHeaderCell = styled.Text<{ flex?: number }>`
  flex: ${(p: any) => p.flex ?? 1};
  font-size: 12px;
  font-weight: 700;
  color: ${theme.colors.textLight};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const TableRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 14px 16px;
  border-left-width: 1px;
  border-right-width: 1px;
  border-bottom-width: 1px;
  border-color: ${theme.colors.border};
  background-color: white;
`;

export const Cell = styled.Text<{ flex?: number; muted?: boolean }>`
  flex: ${(p: any) => p.flex ?? 1};
  font-size: 14px;
  color: ${(p: any) => p.muted ? theme.colors.textLight : theme.colors.text};
`;

export const RoleBadge = styled.View<{ role: string }>`
  background-color: ${(p: any) => p.role === 'admin' ? '#eff6ff' : '#f0fdf4'};
  padding: 3px 10px;
  border-radius: 20px;
  align-self: flex-start;
`;

export const RoleBadgeText = styled.Text<{ role: string }>`
  font-size: 12px;
  font-weight: 600;
  color: ${(p: any) => p.role === 'admin' ? '#1d4ed8' : '#16a34a'};
`;

export const ActionsCell = styled.View`
  flex-direction: row;
  gap: 8px;
  justify-content: flex-end;
`;

export const IconButton = styled.TouchableOpacity<{ danger?: boolean }>`
  padding: 6px;
  border-radius: 6px;
  background-color: ${(p: any) => p.danger ? '#fef2f2' : '#f8fafc'};
`;

/* Modal */
export const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0,0,0,0.4);
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

export const ModalBox = styled.ScrollView`
  background-color: white;
  border-radius: 12px;
  width: 100%;
  max-width: 520px;
`;

export const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 16px;
  border-bottom-width: 1px;
  border-color: ${theme.colors.border};
`;

export const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

export const ModalBody = styled.View`
  padding: 20px 24px;
  gap: 14px;
`;

export const ModalFooter = styled.View`
  flex-direction: row;
  gap: 10px;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top-width: 1px;
  border-color: ${theme.colors.border};
`;

export const Label = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${theme.colors.text};
  margin-bottom: 5px;
`;

export const FieldGroup = styled.View``;

export const Input = styled.TextInput<{ error?: boolean }>`
  height: 44px;
  border-width: 1.5px;
  border-color: ${(p: any) => p.error ? '#ef4444' : theme.colors.border};
  border-radius: 8px;
  padding: 0 12px;
  font-size: 15px;
  color: ${theme.colors.text};
  background-color: white;
  outline-style: none;
`;

export const Row2 = styled.View`
  flex-direction: row;
  gap: 12px;
`;

export const FlexField = styled.View`
  flex: 1;
`;

export const SelectBox = styled.TouchableOpacity`
  height: 44px;
  border-width: 1.5px;
  border-color: ${theme.colors.border};
  border-radius: 8px;
  padding: 0 12px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: white;
`;

export const SelectText = styled.Text`
  font-size: 15px;
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

export const SaveButton = styled.TouchableOpacity<{ loading?: boolean }>`
  background-color: ${(p: any) => p.loading ? '#94a3b8' : '#0f172a'};
  padding: 11px 24px;
  border-radius: 8px;
  align-items: center;
`;

export const SaveButtonText = styled.Text`
  color: white;
  font-weight: 600;
  font-size: 15px;
`;

export const CancelButton = styled.TouchableOpacity`
  padding: 11px 24px;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  align-items: center;
`;

export const CancelButtonText = styled.Text`
  font-size: 15px;
  color: ${theme.colors.text};
`;

export const EmptyState = styled.View`
  padding: 48px;
  align-items: center;
  gap: 8px;
`;

export const EmptyText = styled.Text`
  font-size: 15px;
  color: ${theme.colors.textLight};
`;

export const Toast = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  background-color: #f0fdf4;
  border-width: 1px;
  border-color: #bbf7d0;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
`;

export const ToastText = styled.Text`
  font-size: 14px;
  color: #16a34a;
  font-weight: 500;
`;

export const AccessDenied = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 48px;
`;

export const AccessDeniedText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

export const AccessDeniedSub = styled.Text`
  font-size: 14px;
  color: ${theme.colors.textLight};
  text-align: center;
`;
