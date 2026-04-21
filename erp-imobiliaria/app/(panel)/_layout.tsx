import React, { useEffect, useState } from 'react';
import { Tabs, useRouter, usePathname, Redirect } from 'expo-router';
import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { LayoutDashboard, Home, Users, DollarSign, MessageSquare, Calendar, LogOut, UserCog } from 'lucide-react-native';
import { theme } from '../../theme';
import { getToken, getUser, clearAuth } from '../auth'; // Certifique-se que esse path está correto
import * as S from './layout.styles';

export default function PanelLayout() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<{ full_name?: string | null; role?: string | null } | null>(null);

  useEffect(() => {
    const token = getToken();
    const stored = getUser();
    setAuthenticated(!!token);
    setUser(stored);
    setChecking(false);
  }, []);

  if (checking) return null;

  // Se não estiver autenticado, redireciona para a tela de login (que deve estar fora da pasta (panel))
  if (!authenticated) {
    return <Redirect href="/login" />;
  }

  // Função para verificar se a rota está ativa
  // Importante: No Expo Router, a rota raiz do grupo é "/"
  const isActive = (path: string) => pathname === path;

  function handleLogout() {
    clearAuth();
    router.replace('/login');
  }

  return (
    <S.MainContainer isMobile={isMobile}>
      {/* SIDEBAR - Visível apenas em Desktop */}
      {!isMobile && (
        <S.SidebarContainer>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.primary, marginBottom: 30, paddingHorizontal: 16 }}>
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
            onPress={() => router.push('/clientes/clientes')} 
          />
          <SidebarItem 
            icon={<DollarSign size={20} />} 
            label="Vendas" 
            active={isActive('/vendas')} 
            onPress={() => router.push('/vendas/vendas')} 
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
            onPress={() => router.push('/calendario/calendario')} 
          />

          {user?.role === 'admin' && (
            <SidebarItem 
              icon={<UserCog size={20} />} 
              label="Funcionários" 
              active={isActive('/funcionarios')} 
              onPress={() => router.push('/funcionarios')} 
            />
          )}
        </S.SidebarContainer>
      )}

      <S.ContentArea>
        {/* HEADER */}
        <S.Header>
          <Text style={{ fontWeight: 'bold', color: theme.colors.primary, display: isMobile ? 'flex' : 'none' }}>ERP</Text>
          <View />
          <S.UserInfo>
            <S.UserTexts>
              <S.UserName>{user?.full_name ?? 'Usuário'}</S.UserName>
              {!isMobile && <S.UserRole>{user?.role ?? 'corretor'}</S.UserRole>}
            </S.UserTexts>
            <TouchableOpacity onPress={handleLogout} style={{ marginLeft: 12 }}>
              <LogOut color={theme.colors.textLight} size={20} />
            </TouchableOpacity>
          </S.UserInfo>
        </S.Header>

        {/* NAVEGAÇÃO POR TABS (Mobile) / RENDERIZAÇÃO DAS PÁGINAS (Desktop) */}
        <Tabs screenOptions={{
          headerShown: false,
          // Se for Desktop, esconde a barra de abas inferior
          tabBarStyle: isMobile ? { height: 65, paddingBottom: 10, backgroundColor: 'white' } : { display: 'none' },
          tabBarActiveTintColor: theme.colors.primary,
        }}>
          {/* O 'name' deve ser exatamente o nome do arquivo .tsx */}
          <Tabs.Screen 
            name="index" 
            options={{ title: 'Home', tabBarIcon: ({ color }) => <LayoutDashboard color={color} size={22} /> }} 
          />
          <Tabs.Screen 
            name="imoveis" 
            options={{ title: 'Imóveis', tabBarIcon: ({ color }) => <Home color={color} size={22} /> }} 
          />
          <Tabs.Screen 
            name="clientes" 
            options={{ title: 'Clientes', tabBarIcon: ({ color }) => <Users color={color} size={22} /> }} 
          />
          
          {/* Rotas que não aparecem na TabBar do Mobile (href: null) */}
          <Tabs.Screen name="vendas" options={{ href: null }} />
          <Tabs.Screen name="leads" options={{ href: null }} />
          <Tabs.Screen name="calendario" options={{ href: null }} />
          <Tabs.Screen name="funcionarios" options={{ href: null }} />
        </Tabs>
      </S.ContentArea>
    </S.MainContainer>
  );
}

function SidebarItem({ icon, label, active = false, onPress }: any) {
  return (
    <S.SidebarItemContainer active={active} onPress={onPress}>
      {/* O cloneElement serve para passar a cor do tema para o ícone do Lucide automaticamente */}
      {React.cloneElement(icon, { color: active ? theme.colors.primary : theme.colors.textLight })}
      <S.SidebarText active={active}>{label}</S.SidebarText>
    </S.SidebarItemContainer>
  );
}