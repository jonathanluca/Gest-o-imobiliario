// erp-imobiliario-api/src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error("DATABASE_URL não encontrada no arquivo .env");
}

const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });
