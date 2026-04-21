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

/* ─── Cards de resumo ─────────────────────────────────────────────────────── */

export const StatsRow = styled.View`
  flex-direction: row;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

export const SummaryCard = styled.View`
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  flex: 1;
  min-width: ${isWeb ? '200px' : '100%'};
`;

export const CardHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const CardLabel = styled.Text`
  font-size: 13px;
  color: ${theme.colors.textLight};
  font-weight: 500;
`;

export const CardValue = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

/* ─── Filtros ─────────────────────────────────────────────────────────────── */

export const FilterSection = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-bottom: 28px;
  flex-wrap: wrap;
`;

export const SearchInputBox = styled.View`
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
  gap: 8px;
`;

export const FilterDropdownBtn = styled.TouchableOpacity`
  width: ${isWeb ? '200px' : '100%'};
  height: 45px;
  background-color: white;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
`;

/* ─── Tabela ──────────────────────────────────────────────────────────────── */

export const TableScrollH = styled.ScrollView`
  margin-bottom: 20px;
`;

export const TableContainer = styled.View`
  background-color: white;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  overflow: hidden;
`;

export const TableHeader = styled.View`
  flex-direction: row;
  padding: 14px 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
  background-color: #fafafa;
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

export const PropertyInfo = styled.View``;

export const PropertyName = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.text};
`;

export const PropertyLocation = styled.Text`
  font-size: 11px;
  color: ${theme.colors.textLight};
  margin-top: 1px;
`;

export const TextCell = styled.Text`
  font-size: 13px;
  color: ${theme.colors.text};
`;

export const CommissionValue = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: ${theme.colors.success};
`;

export const CommissionPercent = styled.Text`
  font-size: 11px;
  color: ${theme.colors.textLight};
  margin-top: 1px;
`;

export const IconBtn = styled.TouchableOpacity<{ variant?: 'danger' }>`
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
  max-width: ${isWeb ? '580px' : '100%'};
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
  flex: 1;
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
