
import { Tabs, useRouter, usePathname } from 'expo-router';
import { View, Text, useWindowDimensions, Platform } from 'react-native';
import { LayoutDashboard, Home, Users, DollarSign, MessageSquare, Calendar, LogOut } from 'lucide-react-native';
import { theme } from '../../theme';
import * as S from './layout.styles';

export default function PanelLayout() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768; // Breakpoint padrão para tablets/celulares
    const router = useRouter();
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <S.MainContainer isMobile={isMobile}>
      {/* SIDEBAR - Só renderiza se NÃO for mobile */}
      {!isMobile && (
        <S.SidebarContainer>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.primary, marginBottom: 30 }}>
            🏢 ERP Imobiliário
          </Text>
        <SidebarItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={isActive('/')} 
            onPress={() => router.push('/')} 
          />
          <SidebarItem 
            icon={<Home size={20} />} 
            label="Imóveis" 
            active={isActive('/imoveis')} 
            onPress={() => router.push('/imoveis/imoveis')} 
          />
          <SidebarItem 
            icon={<Users size={20} />} 
            label="Clientes" 
            active={isActive('/clientes')} 
            onPress={() => router.push('/clientes')} 
          />
          <SidebarItem 
            icon={<DollarSign size={20} />} 
            label="Vendas" 
            active={isActive('/vendas')} 
            onPress={() => router.push('/vendas')} 
          />
          <SidebarItem 
            icon={<MessageSquare size={20} />} 
            label="Leads" 
            active={isActive('/leads')} 
            onPress={() => router.push('/leads')} 
          />
          <SidebarItem 
            icon={<Calendar size={20} />} 
            label="Calendário" 
            active={isActive('/calendario')} 
            onPress={() => router.push('/calendario')} 
          />
        </S.SidebarContainer>
      )}


       <S.ContentArea>
        <S.Header>
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
          tabBarStyle: isMobile ? { height: 65, paddingBottom: 10 } : { display: 'none' },
          tabBarActiveTintColor: theme.colors.primary,
        }}>
          <Tabs.Screen name="index" options={{ title: 'Dashboard', tabBarIcon: ({color}) => <LayoutDashboard color={color} size={22}/> }} />
          <Tabs.Screen name="imoveis" options={{ title: 'Imóveis', tabBarIcon: ({color}) => <Home color={color} size={22}/> }} />
          <Tabs.Screen name="clientes" options={{ title: 'Clientes', tabBarIcon: ({color}) => <Users color={color} size={22}/> }} />
          {/* Ocultar as outras rotas da TabBar mobile se não quiser que apareçam todas embaixo */}
          <Tabs.Screen name="vendas" options={{ href: null }} />
          <Tabs.Screen name="leads" options={{ href: null }} />
          <Tabs.Screen name="calendario" options={{ href: null }} />
        </Tabs>
      </S.ContentArea>
    </S.MainContainer>
  );
}

function SidebarItem({ icon, label, active = false, onPress }: any) {
  return (
    <S.SidebarItemContainer active={active} onPress={onPress}>
      {require('react').cloneElement(icon, { color: active ? theme.colors.primary : theme.colors.textLight })}
      <S.SidebarText active={active}>{label}</S.SidebarText>
    </S.SidebarItemContainer>
  );
}