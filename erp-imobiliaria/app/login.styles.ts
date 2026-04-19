import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { theme } from '../theme';

export const Screen = styled.View`
  flex: 1;
  flex-direction: ${Platform.OS === 'web' ? 'row' : 'column'};
  background-color: ${theme.colors.background};
`;

// ── Painel esquerdo (só desktop) ──────────────────────────────────────────────
export const Brand = styled.View`
  display: ${Platform.OS === 'web' ? 'flex' : 'none'};
  width: 45%;
  background-color: #0f172a;
  padding: 60px 48px;
  justify-content: space-between;
`;

export const BrandTop = styled.View``;

export const BrandLogo = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: white;
  margin-bottom: 8px;
`;

export const BrandTagline = styled.Text`
  font-size: 14px;
  color: #94a3b8;
`;

export const BrandCenter = styled.View``;

export const BrandHeadline = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: white;
  line-height: 42px;
  margin-bottom: 16px;
`;

export const BrandSub = styled.Text`
  font-size: 15px;
  color: #94a3b8;
  line-height: 24px;
`;

export const BrandStats = styled.View`
  flex-direction: row;
  gap: 32px;
`;

export const StatBlock = styled.View``;

export const StatNumber = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: white;
`;

export const StatLabel = styled.Text`
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
`;

// ── Painel direito (formulário) ────────────────────────────────────────────────
export const FormPanel = styled.ScrollView`
  flex: 1;
`;

export const FormInner = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${Platform.OS === 'web' ? '60px 48px' : '48px 24px'};
  min-height: 100%;
`;

export const MobileLogo = styled.Text`
  display: ${Platform.OS === 'web' ? 'none' : 'flex'};
  font-size: 22px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 32px;
`;

export const FormCard = styled.View`
  width: 100%;
  max-width: 400px;
`;

export const FormTitle = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 8px;
`;

export const FormSubtitle = styled.Text`
  font-size: 15px;
  color: ${theme.colors.textLight};
  margin-bottom: 36px;
`;

export const Label = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.text};
  margin-bottom: 8px;
`;

export const InputWrapper = styled.View<{ focused?: boolean }>`
  flex-direction: row;
  align-items: center;
  height: 50px;
  border-width: 1.5px;
  border-color: ${(p: any) => p.focused ? theme.colors.primary : theme.colors.border};
  border-radius: 10px;
  background-color: white;
  padding: 0 14px;
  gap: 10px;
  margin-bottom: 20px;
`;

export const StyledInput = styled.TextInput`
  flex: 1;
  font-size: 15px;
  color: ${theme.colors.text};
  outline-style: none;
`;

export const PasswordToggle = styled.TouchableOpacity`
  padding: 4px;
`;

export const ErrorBox = styled.View`
  background-color: #fef2f2;
  border-width: 1px;
  border-color: #fecaca;
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 20px;
`;

export const ErrorText = styled.Text`
  color: #dc2626;
  font-size: 14px;
`;

export const LoginButton = styled.TouchableOpacity<{ loading?: boolean }>`
  height: 52px;
  background-color: ${(p: any) => p.loading ? '#93c5fd' : '#0f172a'};
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin-top: 4px;
`;

export const LoginButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

export const Divider = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 24px 0;
  gap: 12px;
`;

export const DividerLine = styled.View`
  flex: 1;
  height: 1px;
  background-color: ${theme.colors.border};
`;

export const DividerText = styled.Text`
  font-size: 13px;
  color: ${theme.colors.textLight};
`;

export const RegisterLink = styled.TouchableOpacity`
  align-items: center;
  padding: 8px;
`;

export const RegisterLinkText = styled.Text`
  font-size: 14px;
  color: ${theme.colors.primary};
  font-weight: 600;
`;

export const Footer = styled.Text`
  font-size: 12px;
  color: ${theme.colors.textLight};
  text-align: center;
  margin-top: 32px;
`;
