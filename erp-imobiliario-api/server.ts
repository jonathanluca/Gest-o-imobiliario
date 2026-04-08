import express from "express";
import cors from "cors";
import { PrismaClient, Prisma } from "@prisma/client";

import fs from "fs";
import path from "path";
import "dotenv/config";

const app = express();
// Teste físico do arquivo
const envPath = path.resolve(process.cwd(), ".env");

console.log("Procurando .env em:", envPath);
console.log("Arquivo existe?", fs.existsSync(envPath) ? "SIM" : "NÃO");

// Teste da variável
console.log(
	"DATABASE_URL carregada?",
	process.env.DATABASE_URL ? "SIM" : "NÃO",
);

console.log("Variável carregada:", process.env.DATABASE_URL ? "SIM" : "NÃO");

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
