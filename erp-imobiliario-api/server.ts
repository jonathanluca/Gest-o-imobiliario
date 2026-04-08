import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

// Configurações essenciais
app.use(cors()); // Libera o acesso para o seu React/React Native
app.use(express.json()); // Permite que a API receba dados no formato JSON (POST/PUT)

// ---------------------------------------------------
// ROTAS DA API
// ---------------------------------------------------

// Rota 1: Teste rápido para ver se a API está no ar
app.get("/", (req, res) => {
	res.json({ message: "🏢 API do ERP Imobiliário operando 100%!" });
});

// Rota 2: Listar Imóveis (Trazendo o nome do corretor junto)
app.get("/imoveis", async (req, res) => {
	try {
		const imoveis = await prisma.properties.findMany();
		res.json(imoveis);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Erro ao buscar os imóveis" });
	}
});

// ---------------------------------------------------
// INICIANDO O SERVIDOR
// ---------------------------------------------------
const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
	console.log(`🚀 Servidor rodando com sucesso em http://localhost:${PORT}`);
	console.log(`👉 Teste no navegador: http://localhost:${PORT}/imoveis`);
});
