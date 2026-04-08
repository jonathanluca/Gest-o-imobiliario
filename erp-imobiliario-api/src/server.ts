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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`🚀 Servidor ERP rodando na porta ${PORT}`);
});
export default prisma;
