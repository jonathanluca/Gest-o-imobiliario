import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { LayoutDashboard, Home, Users, DollarSign, MessageSquare, Calendar } from 'lucide-react-native';
import { theme } from '../../src/theme';
 

export default function PanelLayout() {
  const isWeb = Platform.OS === 'web';

  return (
    <PaperProvider>
      <View style={{ flex: 1, flexDirection: isWeb ? 'row' : 'column' }}>
        {/* Aqui no futuro chamaremos o componente <Sidebar /> para Web */}
        
      <Tabs screenOptions={{
      headerShown: true,
      tabBarActiveTintColor: theme.colors.primary,
      tabBarStyle: isWeb ? { display: 'none' } : { height: 60 }, // Esconde abas no Web
    }}>
      <Tabs.Screen name="index" options={{ title: 'Dashboard', tabBarIcon: ({color}) => <LayoutDashboard color={color} /> }} />
      <Tabs.Screen name="imoveis" options={{ title: 'Imóveis', tabBarIcon: ({color}) => <Home color={color} /> }} />
      <Tabs.Screen name="clientes" options={{ title: 'Clientes', tabBarIcon: ({color}) => <Users color={color} /> }} />
      <Tabs.Screen name="vendas" options={{ title: 'Vendas', tabBarIcon: ({color}) => <DollarSign color={color} /> }} />
      <Tabs.Screen name="leads" options={{ title: 'Leads', tabBarIcon: ({color}) => <MessageSquare color={color} /> }} />
      <Tabs.Screen name="calendario" options={{ title: 'Calendário', tabBarIcon: ({color}) => <Calendar color={color} /> }} />
    </Tabs>
  </View>
</PaperProvider>
  );
}