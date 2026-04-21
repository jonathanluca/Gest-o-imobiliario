import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const app = express();
const prisma = new PrismaClient({ adapter });

const JWT_SECRET = process.env.JWT_SECRET || "erp-imobiliario-secret-dev";

app.use(cors());
app.use(express.json());

// ─── MIDDLEWARE DE AUTH ──────────────────────────────────────────────────────

function authMiddleware(req: any, res: any, next: any) {
	const header = req.headers.authorization;
	if (!header?.startsWith("Bearer ")) {
		return res.status(401).json({ error: "Token não fornecido" });
	}
	try {
		const token = header.split(" ")[1];
		req.user = jwt.verify(token, JWT_SECRET);
		next();
	} catch {
		// Adicione o "return" aqui:
		return res.status(401).json({ error: "Token inválido ou expirado" });
	}
}

function adminMiddleware(req: any, res: any, next: any) {
	if (req.user?.role !== "admin") {
		return res.status(403).json({ error: "Acesso restrito a administradores" });
	}
	next();
}

// ─── AUTH ────────────────────────────────────────────────────────────────────

// Só admin pode criar usuários
app.post("/api/auth/register", authMiddleware, adminMiddleware, async (req, res) => {
	try {
		const { full_name, email, password, role } = req.body;
		if (!email || !password || !full_name) {
			return res.status(400).json({ error: "Nome, e-mail e senha são obrigatórios" });
		}
		const existing = await prisma.profile.findUnique({ where: { email } });
		if (existing) {
			return res.status(409).json({ error: "E-mail já cadastrado" });
		}
		const password_hash = await bcrypt.hash(password, 10);
		const profile = await prisma.profile.create({
			data: { id: randomUUID(), full_name, email, password_hash, role: role || "corretor" },
		});
		res.status(201).json({ id: profile.id, full_name: profile.full_name, email: profile.email, role: profile.role });
	} catch (error) {
		res.status(500).json({ error: "Erro ao criar conta" });
	}
});

app.post("/api/auth/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ error: "E-mail e senha são obrigatórios" });
		}
		const profile = await prisma.profile.findUnique({ where: { email } });
		if (!profile || !profile.password_hash) {
			return res.status(401).json({ error: "Credenciais inválidas" });
		}
		const valid = await bcrypt.compare(password, profile.password_hash);
		if (!valid) {
			return res.status(401).json({ error: "Credenciais inválidas" });
		}
		const user = { id: profile.id, full_name: profile.full_name, email: profile.email, role: profile.role };
		const token = jwt.sign(user, JWT_SECRET, { expiresIn: "8h" });
		res.json({ token, user });
	} catch (error) {
		res.status(500).json({ error: "Erro ao fazer login" });
	}
});

app.get("/api/auth/me", authMiddleware, async (req: any, res) => {
	try {
		const profile = await prisma.profile.findUnique({
			where: { id: req.user.id },
			select: { id: true, full_name: true, email: true, role: true, avatar_url: true },
		});
		if (!profile) return res.status(404).json({ error: "Usuário não encontrado" });
		res.json(profile);
	} catch {
		res.status(500).json({ error: "Erro ao buscar usuário" });
	}
});

// ─── FUNCIONÁRIOS ────────────────────────────────────────────────────────────

app.get("/api/funcionarios", authMiddleware, adminMiddleware, async (req, res) => {
	try {
		const { search } = req.query;
		const where: any = search
			? {
				OR: [
					{ full_name: { contains: String(search), mode: "insensitive" } },
					{ email: { contains: String(search), mode: "insensitive" } },
					{ cpf: { contains: String(search) } },
				],
			  }
			: {};
		const funcionarios = await prisma.profile.findMany({
			where,
			select: { id: true, full_name: true, email: true, role: true, cpf: true, created_at: true },
			orderBy: { created_at: "desc" },
		});
		res.json(funcionarios);
	} catch {
		res.status(500).json({ error: "Erro ao buscar funcionários" });
	}
});

app.post("/api/funcionarios", authMiddleware, adminMiddleware, async (req, res) => {
	try {
		const { full_name, email, password, role, cpf } = req.body;
		if (!full_name || !email || !password || !cpf) {
			return res.status(400).json({ error: "Nome, e-mail, senha e CPF são obrigatórios" });
		}
		const existing = await prisma.profile.findUnique({ where: { email } });
		if (existing) return res.status(409).json({ error: "E-mail já cadastrado" });
		const password_hash = await bcrypt.hash(password, 10);
		const funcionario = await prisma.profile.create({
			data: {
				id: randomUUID(),
				full_name,
				email,
				password_hash,
				role: role || "corretor",
				cpf,
			},
			select: { id: true, full_name: true, email: true, role: true, cpf: true, created_at: true },
		});
		res.status(201).json(funcionario);
	} catch (error: any) {
		if (error?.code === "P2002") return res.status(409).json({ error: "CPF ou e-mail já cadastrado" });
		res.status(500).json({ error: "Erro ao criar funcionário" });
	}
});

app.put("/api/funcionarios/:id", authMiddleware, adminMiddleware, async (req, res) => {
	try {
		const { full_name, email, role, cpf } = req.body;
		const funcionario = await prisma.profile.update({
			where: { id: req.params.id },
			data: { full_name, email, role, cpf },
			select: { id: true, full_name: true, email: true, role: true, cpf: true, created_at: true },
		});
		res.json(funcionario);
	} catch (error: any) {
		if (error?.code === "P2002") return res.status(409).json({ error: "CPF ou e-mail já cadastrado" });
		res.status(500).json({ error: "Erro ao atualizar funcionário" });
	}
});

app.delete("/api/funcionarios/:id", authMiddleware, adminMiddleware, async (req: any, res) => {
	try {
		if (req.params.id === req.user.id) {
			return res.status(400).json({ error: "Não é possível excluir seu próprio usuário" });
		}
		await prisma.profile.delete({ where: { id: req.params.id } });
		res.status(204).send();
	} catch {
		res.status(500).json({ error: "Erro ao excluir funcionário" });
	}
});

// ─── DASHBOARD ───────────────────────────────────────────────────────────────

app.get("/api/dashboard/stats", authMiddleware, async (req, res) => {
	try {
		const imoveisDisponiveis = await prisma.property.count({
			where: { status: "Disponível" },
		});
		const totalVendas = await prisma.sale.aggregate({
			_sum: { total_value: true },
		});
		const leadsAtivos = await prisma.lead.count({
			where: { NOT: { status: "Convertido" } },
		});
		res.json({
			imoveisDisponiveis,
			totalVendas: totalVendas._sum.total_value || 0,
			leadsAtivos,
		});
	} catch (error) {
		res.status(500).json({ error: "Erro ao buscar dados do dashboard" });
	}
});

// ─── IMÓVEIS ─────────────────────────────────────────────────────────────────

app.get("/api/imoveis", authMiddleware, async (req, res) => {
	try {
		const { search, status } = req.query;
		const where: any = {};
		if (status && status !== "todos") where.status = String(status);
		if (search) {
			where.OR = [
				{ title: { contains: String(search), mode: "insensitive" } },
				{ city: { contains: String(search), mode: "insensitive" } },
				{ address: { contains: String(search), mode: "insensitive" } },
			];
		}
		const imoveis = await prisma.property.findMany({
			where,
			include: { broker: { select: { full_name: true } } },
			orderBy: { created_at: "desc" },
		});
		res.json(imoveis);
	} catch (error) {
		res.status(500).json({ error: "Erro ao buscar imóveis" });
	}
});

app.get("/api/imoveis/:id", authMiddleware, async (req, res) => {
	try {
		const imovel = await prisma.property.findUnique({
			where: { id: req.params.id },
			include: { broker: { select: { full_name: true } } },
		});
		if (!imovel) return res.status(404).json({ error: "Imóvel não encontrado" });
		res.json(imovel);
	} catch (error) {
		res.status(500).json({ error: "Erro ao buscar imóvel" });
	}
});

app.post("/api/imoveis", authMiddleware, async (req, res) => {
	try {
		const { title, type, status, address, city, state, zip_code, area, bedrooms, suites, bathrooms, parking_spots, price, broker_id, description, images } = req.body;
		const imovel = await prisma.property.create({
			data: {
				title, type, status, address, city, state, zip_code,
				area: parseFloat(area) || 0,
				bedrooms: parseInt(bedrooms) || 0,
				suites: parseInt(suites) || 0,
				bathrooms: parseInt(bathrooms) || 0,
				parking_spots: parseInt(parking_spots) || 0,
				price: parseFloat(price) || 0,
				broker_id: broker_id || null,
				description,
				images: images || [],
			},
		});
		res.status(201).json(imovel);
	} catch (error) {
		res.status(500).json({ error: "Erro ao criar imóvel" });
	}
});

app.put("/api/imoveis/:id", authMiddleware, async (req, res) => {
	try {
		const { title, type, status, address, city, state, zip_code, area, bedrooms, suites, bathrooms, parking_spots, price, broker_id, description, images } = req.body;
		const imovel = await prisma.property.update({
			where: { id: req.params.id },
			data: {
				title, type, status, address, city, state, zip_code,
				area: parseFloat(area) || 0,
				bedrooms: parseInt(bedrooms) || 0,
				suites: parseInt(suites) || 0,
				bathrooms: parseInt(bathrooms) || 0,
				parking_spots: parseInt(parking_spots) || 0,
				price: parseFloat(price) || 0,
				broker_id: broker_id || null,
				description,
				images: images || [],
			},
		});
		res.json(imovel);
	} catch (error) {
		res.status(500).json({ error: "Erro ao atualizar imóvel" });
	}
});

app.delete("/api/imoveis/:id", authMiddleware, async (req, res) => {
	try {
		await prisma.property.delete({ where: { id: req.params.id } });
		res.status(204).send();
	} catch (error) {
		res.status(500).json({ error: "Erro ao excluir imóvel" });
	}
});

// ─── CLIENTES ────────────────────────────────────────────────────────────────

app.get("/api/clientes", authMiddleware, async (req, res) => {
	try {
		const { search, type } = req.query;
		const where: any = {};
		if (type && type !== "todos") where.type = String(type);
		if (search) {
			where.OR = [
				{ name: { contains: String(search), mode: "insensitive" } },
				{ email: { contains: String(search), mode: "insensitive" } },
				{ document: { contains: String(search) } },
				{ phone: { contains: String(search) } },
			];
		}

		const clientes = await prisma.client.findMany({
			where,
			orderBy: { created_at: "desc" },
		});
		res.json(clientes);
	} catch (error) {
		res.status(500).json({ error: "Erro ao buscar clientes" });
	}
});

app.get("/api/clientes/:id", authMiddleware, async (req, res) => {
	try {
		const cliente = await prisma.client.findUnique({ where: { id: req.params.id } });
		if (!cliente) return res.status(404).json({ error: "Cliente não encontrado" });
		res.json(cliente);
	} catch (error) {
		res.status(500).json({ error: "Erro ao buscar cliente" });
	}
});

app.post("/api/clientes", authMiddleware, async (req, res) => {
	try {
		const { name, email, phone, document, type, notes } = req.body;

		if (!name || !name.trim()) {
			return res.status(400).json({ error: "Nome é obrigatório" });
		}
		if (document) {
			const existing = await prisma.client.findFirst({ where: { document } });
			if (existing) return res.status(409).json({ error: "CPF já cadastrado" });
		}
		const cliente = await prisma.client.create({
			data: { name: name.trim(), email: email || null, phone: phone || null, document: document || null, type: type || null, notes: notes || null },
		});
		res.status(201).json(cliente);
	} catch (error) {
		res.status(500).json({ error: "Erro ao criar cliente" });
	}
});

app.put("/api/clientes/:id", authMiddleware, async (req, res) => {
	try {
		const { name, email, phone, document, type, notes } = req.body;

		if (!name || !name.trim()) {
			return res.status(400).json({ error: "Nome é obrigatório" });
		}
		if (document) {
			const existing = await prisma.client.findFirst({ where: { document, NOT: { id: req.params.id } } });
			if (existing) return res.status(409).json({ error: "CPF já cadastrado para outro cliente" });
		}
		const cliente = await prisma.client.update({
			where: { id: req.params.id },
			data: { name: name.trim(), email: email || null, phone: phone || null, document: document || null, type: type || null, notes: notes || null },
		});
		res.json(cliente);
	} catch (error) {
		res.status(500).json({ error: "Erro ao atualizar cliente" });
	}
});

app.delete("/api/clientes/:id", authMiddleware, async (req, res) => {
	try {
		await prisma.client.delete({ where: { id: req.params.id } });
		res.status(204).send();
	} catch (error) {
		res.status(500).json({ error: "Erro ao excluir cliente" });
	}
});

// ─── START ───────────────────────────────────────────────────────────────────

async function main() {
	// Remove FK para auth.users (usamos JWT próprio, não Supabase Auth)
	try {
		await prisma.$executeRaw`
			ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
		`;
		await prisma.$executeRaw`
			ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS password_hash TEXT;
		`;
	} catch {}

	const PORT = process.env.PORT || 3000;
	app.listen(PORT, () => {
		console.log(`🚀 Servidor ERP rodando na porta ${PORT}`);
	});
}

app.get("/api/visitas", authMiddleware, async (req, res) => {
	console.log("Buscando visitas...");
	try {
		const { mes, ano } = req.query;
		
		let where: any = {};
		
		// Verifica se enviou mês e ano e se são números válidos
		if (mes && ano) {
			const parsedAno = parseInt(String(ano));
			const parsedMes = parseInt(String(mes));

			if (!isNaN(parsedAno) && !isNaN(parsedMes)) {
				const startDate = new Date(parsedAno, parsedMes - 1, 1);
				const endDate = new Date(parsedAno, parsedMes, 0);
				where.date = { gte: startDate, lte: endDate };
			}
		}

		const visitas = await prisma.visit.findMany({
			where,
			include: {
				property: { select: { title: true, address: true } },
				client: { select: { name: true } },
				broker: { select: { full_name: true } }
			},
			orderBy: { date: "asc" },
		});
		res.json(visitas);
	} catch (error) {
		console.error("Erro na rota GET /api/visitas:", error); // <-- Essencial para ver o erro real
		res.status(500).json({ error: "Erro ao buscar visitas" });
	}
});

// Criar nova visita
app.post("/api/visitas", authMiddleware, async (req: any, res) => {
	try {
		const { title, date, description, property_id, client_id, status } = req.body;
		
		if (!date || !property_id || !client_id) {
			return res.status(400).json({ error: "Data, Imóvel e Cliente são obrigatórios" });
		}

		const visita = await prisma.visit.create({
			data: {
				id: randomUUID(),
				title,
				date: new Date(date),
				description,
				status: status || "Agendada",
				property_id,
				client_id,
				broker_id: req.user.id // O corretor logado é o responsável
			},
		});
		res.status(201).json(visita);
	} catch (error) {
		res.status(500).json({ error: "Erro ao agendar visita" });
	}
});

// Atualizar visita (Alterar data, status ou descrição)
app.put("/api/visitas/:id", authMiddleware, async (req, res) => {
	try {
		const { title, date, description, status, property_id, client_id } = req.body;
		
		const visita = await prisma.visit.update({
			where: { id: req.params.id },
			data: {
				title,
				date: date ? new Date(date) : undefined,
				description,
				status,
				property_id,
				client_id
			},
		});
		res.json(visita);
	} catch (error) {
		res.status(500).json({ error: "Erro ao atualizar visita" });
	}
});

// Deletar visita
app.delete("/api/visitas/:id", authMiddleware, async (req, res) => {
	console.log("deletando visita...");
	try {
		await prisma.visit.delete({ where: { id: req.params.id } });
		res.status(204).send();
	} catch (error) {
		res.status(500).json({ error: "Erro ao excluir visita" });
	}
});


main().catch(console.error);
