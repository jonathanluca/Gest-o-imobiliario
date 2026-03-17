import { Tabs } from 'expo-router';
import { View, Text, useWindowDimensions, Platform } from 'react-native';
import { LayoutDashboard, Home, Users, DollarSign, MessageSquare, Calendar, LogOut } from 'lucide-react-native';
import { theme } from '../../theme';
import * as S from './layout.styles';

export default function PanelLayout() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768; // Breakpoint padrão para tablets/celulares

  return (
    <S.MainContainer isMobile={isMobile}>
      {/* SIDEBAR - Só renderiza se NÃO for mobile */}
      {!isMobile && (
        <S.SidebarContainer>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.primary, marginBottom: 30 }}>
            🏢 ERP Imobiliário
          </Text>
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <SidebarItem icon={<Home size={20} />} label="Imóveis" />
          <SidebarItem icon={<Users size={20} />} label="Clientes" />
          <SidebarItem icon={<DollarSign size={20} />} label="Vendas" />
          <SidebarItem icon={<MessageSquare size={20} />} label="Leads" />
          <SidebarItem icon={<Calendar size={20} />} label="Calendário" />
        </S.SidebarContainer>
      )}

      <S.ContentArea>
        <S.Header>
          {/* No mobile web, você poderia colocar um ícone de menu aqui */}
          <Text style={{ fontWeight: 'bold', display: isMobile ? 'flex' : 'none' }}>ERP</Text>
          <View /> 
          <S.UserInfo>
            <S.UserTexts>
              <S.UserName>Admin Silva</S.UserName>
              {!isMobile && <S.UserRole>Administrador</S.UserRole>}
            </S.UserTexts>
            <LogOut color={theme.colors.textLight} size={20} />
          </S.UserInfo>
        </S.Header>

        <Tabs screenOptions={{
          headerShown: false,
          // A TabBar (baixo) só aparece no Mobile
          tabBarStyle: isMobile ? { height: 65, paddingBottom: 10 } : { display: 'none' },
          tabBarActiveTintColor: theme.colors.primary,
        }}>
          <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({color}) => <LayoutDashboard color={color} size={22}/> }} />
          <Tabs.Screen name="imoveis" options={{ title: 'Imóveis', tabBarIcon: ({color}) => <Home color={color} size={22}/> }} />
          <Tabs.Screen name="clientes" options={{ title: 'Clientes', tabBarIcon: ({color}) => <Users color={color} size={22}/> }} />
        </Tabs>
      </S.ContentArea>
    </S.MainContainer>
  );
}

function SidebarItem({ icon, label, active = false }: any) {
  return (
    <S.SidebarItemContainer active={active}>
      {require('react').cloneElement(icon, { color: active ? theme.colors.primary : theme.colors.textLight })}
      <S.SidebarText active={active}>{label}</S.SidebarText>
    </S.SidebarItemContainer>
  );
}