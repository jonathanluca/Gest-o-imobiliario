import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ROTA PARA O DASHBOARD
app.get("/api/dashboard/stats", async (req, res) => {
	try {
		const imoveisDisponiveis = await prisma.properties.count({
			where: { status: "Disponível" },
		});

		const totalVendas = await prisma.sales.aggregate({
			_sum: { total_value: true },
		});

		const leadsAtivos = await prisma.leads.count({
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

// ─── IMÓVEIS ────────────────────────────────────────────────────────────────

app.get("/api/imoveis", async (req, res) => {
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

		const imoveis = await prisma.properties.findMany({
			where,
			include: { profiles: { select: { full_name: true } } },
			orderBy: { created_at: "desc" },
		});

		res.json(imoveis);
	} catch (error) {
		res.status(500).json({ error: "Erro ao buscar imóveis" });
	}
});

app.get("/api/imoveis/:id", async (req, res) => {
	try {
		const imovel = await prisma.properties.findUnique({
			where: { id: req.params.id },
			include: { profiles: { select: { full_name: true } } },
		});
		if (!imovel) return res.status(404).json({ error: "Imóvel não encontrado" });
		res.json(imovel);
	} catch (error) {
		res.status(500).json({ error: "Erro ao buscar imóvel" });
	}
});

app.post("/api/imoveis", async (req, res) => {
	try {
		const {
			title, type, status, address, city, state, zip_code,
			area, bedrooms, suites, bathrooms, parking_spots,
			price, broker_id, description, images,
		} = req.body;

		const imovel = await prisma.properties.create({
			data: {
				title,
				type,
				status,
				address,
				city,
				state,
				zip_code,
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

app.put("/api/imoveis/:id", async (req, res) => {
	try {
		const {
			title, type, status, address, city, state, zip_code,
			area, bedrooms, suites, bathrooms, parking_spots,
			price, broker_id, description, images,
		} = req.body;

		const imovel = await prisma.properties.update({
			where: { id: req.params.id },
			data: {
				title,
				type,
				status,
				address,
				city,
				state,
				zip_code,
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

app.delete("/api/imoveis/:id", async (req, res) => {
	try {
		await prisma.properties.delete({ where: { id: req.params.id } });
		res.status(204).send();
	} catch (error) {
		res.status(500).json({ error: "Erro ao excluir imóvel" });
	}
});

// ────────────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`🚀 Servidor ERP rodando na porta ${PORT}`);
});
export default prisma;
