import "dotenv/config";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
	// Remove FK para auth.users (não usamos Supabase Auth, usamos JWT próprio)
	await prisma.$executeRaw`
		ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
	`;

	// Garante que a coluna password_hash existe
	await prisma.$executeRaw`
		ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS password_hash TEXT;
	`;

	const email = "admin@erp.com";
	const password = "admin@2026";

	const existing = await prisma.profile.findUnique({ where: { email } });

	if (existing) {
		// Atualiza senha e role do admin se já existir
		const password_hash = await bcrypt.hash(password, 10);
		await prisma.profile.update({
			where: { email },
			data: { password_hash, role: "admin" },
		});
		console.log("✅ Admin atualizado com sucesso!");
	} else {
		const password_hash = await bcrypt.hash(password, 10);
		await prisma.profile.create({
			data: {
				id: randomUUID(),
				full_name: "Administrador",
				email,
				password_hash,
				role: "admin",
			},
		});
		console.log("✅ Admin criado com sucesso!");
	}

	console.log("\n🔑 Credenciais de acesso:");
	console.log("   E-mail: admin@erp.com");
	console.log("   Senha:  admin@2026");
	console.log("\n⚠️  Altere a senha após o primeiro login.");

	await prisma.$disconnect();
}

main().catch((e) => {
	console.error("❌ Erro ao criar admin:", e.message);
	process.exit(1);
});
