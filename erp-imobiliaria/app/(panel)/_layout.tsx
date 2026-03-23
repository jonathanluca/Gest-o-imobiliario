import { Tabs } from "expo-router";
import {
	LayoutDashboard,
	Home,
	Users,
	DollarSign,
	MessageSquare,
	Calendar,
} from "lucide-react-native";
import { Platform } from "react-native";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: "#1E40AF", // Azul do seu Figma
				headerShown: true,
				tabBarStyle: Platform.select({
					web: { display: "none" }, // Esconde a barra de baixo no Web (usaremos sidebar)
					default: { height: 60, paddingBottom: 8 },
				}),
			}}>
			<Tabs.Screen
				name='index'
				options={{
					title: "Dashboard",
					tabBarIcon: ({ color }) => (
						<LayoutDashboard size={24} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name='imoveis'
				options={{
					title: "Imóveis",
					tabBarIcon: ({ color }) => <Home size={24} color={color} />,
				}}
			/>
			<Tabs.Screen
				name='clientes'
				options={{
					title: "Clientes",
					tabBarIcon: ({ color }) => <Users size={24} color={color} />,
				}}
			/>
			<Tabs.Screen
				name='vendas'
				options={{
					title: "Vendas",
					tabBarIcon: ({ color }) => (
						<DollarSign size={24} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name='leads'
				options={{
					title: "Leads",
					tabBarIcon: ({ color }) => (
						<MessageSquare size={24} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name='calendario'
				options={{
					title: "Calendário",
					tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
				}}
			/>
		</Tabs>
	);
}
