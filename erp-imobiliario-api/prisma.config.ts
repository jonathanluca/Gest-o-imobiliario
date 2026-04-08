import "dotenv/config";
import { defineConfig } from "@prisma/config";

export default defineConfig({
	schema: "./prisma/schema.prisma",
	datasource: {
		// Aqui ele vai ler a URL do seu arquivo .env
		url: process.env.DATABASE_URL,
	},
});
