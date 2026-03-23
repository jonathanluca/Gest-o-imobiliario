import {
	View,
	Text,
	ScrollView,
	Image,
	TouchableOpacity,
	TextInput,
} from "react-native";
import { Search, Plus, MapPin, BedDouble, Car } from "lucide-react-native";

const imoveisMock = [
	{
		id: 1,
		titulo: "Apartamento Luxo Frente Mar",
		endereco: "Av. Atlântica, 1000, Rio de Janeiro",
		preco: "R$ 2.500.000,00",
		area: "180m²",
		quartos: 3,
		vagas: 2,
		status: "Disponível",
		imagem:
			"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=500&auto=format&fit=crop",
	},
	// Adicione mais se quiser testar o scroll
];

export default function ImoveisScreen() {
	return (
		<ScrollView className='flex-1 bg-slate-50 p-4'>
			{/* Header da Tela */}
			<View className='flex-row justify-between items-center mb-6'>
				<View>
					<Text className='text-2xl font-bold text-slate-900'>
						Imóveis
					</Text>
					<Text className='text-slate-500'>
						Gerencie o catálogo de imóveis
					</Text>
				</View>
				<TouchableOpacity className='bg-black flex-row items-center px-4 py-2 rounded-lg'>
					<Plus size={20} color='white' />
					<Text className='text-white font-bold ml-2'>Novo Imóvel</Text>
				</TouchableOpacity>
			</View>

			{/* Barra de Busca */}
			<View className='bg-white border border-slate-200 rounded-xl p-3 mb-6 flex-row items-center'>
				<Search size={20} color='#64748B' />
				<TextInput
					placeholder='Buscar por título, cidade ou endereço...'
					className='flex-1 ml-2 text-slate-600'
				/>
			</View>

			{/* Grid de Cards (Simulando o Figma) */}
			<View className='flex-row flex-wrap justify-between'>
				{imoveisMock.map((item) => (
					<View
						key={item.id}
						className='bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6 w-full lg:w-[32%] shadow-sm'>
						<Image
							source={{ uri: item.imagem }}
							className='w-full h-48'
						/>

						<View className='p-4'>
							<View className='bg-green-100 self-start px-2 py-1 rounded-md mb-2'>
								<Text className='text-green-700 text-xs font-bold'>
									{item.status}
								</Text>
							</View>

							<Text className='text-lg font-bold text-slate-900 mb-1'>
								{item.titulo}
							</Text>

							<View className='flex-row items-center mb-3'>
								<MapPin size={14} color='#64748B' />
								<Text className='text-slate-500 text-xs ml-1'>
									{item.endereco}
								</Text>
							</View>

							<View className='flex-row justify-between border-t border-slate-100 pt-3 mb-4'>
								<Text className='text-slate-600 text-xs'>
									{item.area}
								</Text>
								<View className='flex-row items-center'>
									<BedDouble size={14} color='#64748B' />
									<Text className='text-slate-600 text-xs ml-1'>
										{item.quartos} qts
									</Text>
								</View>
								<View className='flex-row items-center'>
									<Car size={14} color='#64748B' />
									<Text className='text-slate-600 text-xs ml-1'>
										{item.vagas} vagas
									</Text>
								</View>
							</View>

							<Text className='text-blue-700 text-xl font-bold'>
								{item.preco}
							</Text>
						</View>
					</View>
				))}
			</View>
		</ScrollView>
	);
}
