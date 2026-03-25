import styled from 'styled-components/native';
import { Platform, TouchableOpacity, Text, View } from 'react-native';
import { theme } from '../../theme';

interface ResponsiveProps {
  isMobile?: boolean;
  active?: boolean;
}

export const MainContainer = styled.View<ResponsiveProps>`
  flex: 1;
  flex-direction: ${(props: ResponsiveProps) => props.isMobile ? 'column' : 'row'};
  background-color: ${theme.colors.background};
`;

export const SidebarContainer = styled.View`
  width: 260px;
  background-color: ${theme.colors.white};
  border-right-width: 1px;
  border-right-color: ${theme.colors.border};
  padding: 24px 16px;
  /* No Mobile Web ou App, a Sidebar some para dar lugar à TabBar ou Menu Burguer */
`;

export const SidebarItemContainer = styled(TouchableOpacity)<ResponsiveProps>`
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  background-color: ${(props: ResponsiveProps) => props.active ? theme.colors.sidebarActive : 'transparent'};
  border-radius: 8px;
  margin-bottom: 4px;
`;

export const SidebarText = styled(Text)<ResponsiveProps>`
  margin-left: 12px;
  font-size: 14px;
  font-weight: ${(props: ResponsiveProps) => props.active ? '600' : '400'};
  color: ${(props: ResponsiveProps) => props.active ? theme.colors.primary : theme.colors.textLight};
`;

export const ContentArea = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  height: 70px;
  background-color: ${theme.colors.white};
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
`;

export const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const UserTexts = styled.View`
  align-items: flex-end;
  margin-right: 12px;
`;

export const UserName = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

export const UserRole = styled.Text`
  font-size: 12px;
  color: ${theme.colors.textLight};
`;