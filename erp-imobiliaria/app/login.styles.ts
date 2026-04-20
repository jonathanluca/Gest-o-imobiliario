import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { theme } from '../theme';

const isWeb = Platform.OS === 'web';

export const Screen = styled.View`
  flex: 1;
  flex-direction: ${isWeb ? 'row' : 'column'};
  background-color: ${theme.colors.background};
  ${isWeb ? 'min-height: 100vh;' : ''}
`;

// ── Painel esquerdo ───────────────────────────────────────────────────────────
export const Brand = styled.View`
  display: ${isWeb ? 'flex' : 'none'};
  width: 42%;
  background-color: #0f172a;
  padding: 56px 52px;
  justify-content: center;
  gap: 48px;
`;

export const BrandTop = styled.View`
  gap: 6px;
`;

export const BrandLogo = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: white;
`;

export const BrandTagline = styled.Text`
  font-size: 13px;
  color: #64748b;
`;

export const BrandCenter = styled.View`
  gap: 20px;
`;

export const BrandHeadline = styled.Text`
  font-size: 34px;
  font-weight: bold;
  color: white;
  line-height: 44px;
`;

export const BrandSub = styled.Text`
  font-size: 15px;
  color: #94a3b8;
  line-height: 26px;
`;

export const FeatureList = styled.View`
  gap: 14px;
`;

export const FeatureItem = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

export const FeatureDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${theme.colors.primary};
`;

export const FeatureText = styled.Text`
  font-size: 14px;
  color: #cbd5e1;
`;

export const BrandFooter = styled.Text`
  font-size: 12px;
  color: #334155;
`;

// ── Painel direito (formulário) ───────────────────────────────────────────────
export const FormPanel = styled.ScrollView`
  flex: 1;
  background-color: ${theme.colors.background};
`;

export const FormInner = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${isWeb ? '48px 52px' : '48px 24px'};
  min-height: ${isWeb ? '100vh' : '100%'};
`;

export const MobileLogo = styled.Text`
  display: ${isWeb ? 'none' : 'flex'};
  font-size: 22px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 32px;
`;

export const FormCard = styled.View`
  width: 100%;
  max-width: 420px;
`;

export const FormTitle = styled.Text`
  font-size: 26px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 6px;
`;

export const FormSubtitle = styled.Text`
  font-size: 14px;
  color: ${theme.colors.textLight};
  margin-bottom: 32px;
  line-height: 22px;
`;

export const Label = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${theme.colors.text};
  margin-bottom: 7px;
`;

export const InputWrapper = styled.View<{ focused?: boolean }>`
  flex-direction: row;
  align-items: center;
  height: 48px;
  border-width: 1.5px;
  border-color: ${(p: any) => p.focused ? theme.colors.primary : theme.colors.border};
  border-radius: 10px;
  background-color: white;
  padding: 0 14px;
  gap: 10px;
  margin-bottom: 16px;
  ${isWeb ? 'transition: border-color 0.15s;' : ''}
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
  padding: 11px 14px;
  margin-bottom: 16px;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const ErrorText = styled.Text`
  color: #dc2626;
  font-size: 13px;
  flex: 1;
`;

export const LoginButton = styled.TouchableOpacity<{ loading?: boolean }>`
  height: 50px;
  background-color: ${(p: any) => p.loading ? '#475569' : '#0f172a'};
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin-top: 4px;
`;

export const LoginButtonText = styled.Text`
  color: white;
  font-size: 15px;
  font-weight: bold;
  letter-spacing: 0.3px;
`;

export const Footer = styled.Text`
  font-size: 11px;
  color: #cbd5e1;
  text-align: center;
  margin-top: 28px;
`;
