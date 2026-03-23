import { View, Text } from "react-native";
import { LucideIcon } from "lucide-react-native";

interface StatCardProps {
	label: string;
	value: string;
	subValue?: string;
	Icon: LucideIcon;
	color: string;
}

export function StatCard({
	label,
	value,
	subValue,
	Icon,
	color,
}: StatCardProps) {
	return (
		<View className='bg-white p-6 rounded-xl border border-slate-100 shadow-sm min-w-[200px] flex-1 m-2'>
			<View className='flex-row justify-between items-start mb-4'>
				<View>
					<Text className='text-slate-500 text-sm font-medium'>
						{label}
					</Text>
					<Text className='text-2xl font-bold mt-1'>{value}</Text>
					{subValue && (
						<Text className='text-slate-400 text-xs mt-1'>
							{subValue}
						</Text>
					)}
				</View>
				<View className={`p-2 rounded-lg bg-${color}-50`}>
					<Icon size={20} color={color} />
				</View>
			</View>
		</View>
	);
}
