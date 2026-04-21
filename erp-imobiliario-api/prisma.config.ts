import { readFileSync } from "fs";
import { resolve } from "path";
import { defineConfig } from "@prisma/config";

try {
	const envPath = resolve(__dirname, ".env");
	const envContent = readFileSync(envPath, "utf-8");
	for (const line of envContent.split("\n")) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;
		const [key, ...rest] = trimmed.split("=");
		if (key && !process.env[key]) {
			process.env[key] = rest.join("=").replace(/^"|"$/g, "");
		}
	}
} catch {}

export default defineConfig({
	schema: "./prisma/schema.prisma",
	datasource: {
		url: process.env.DATABASE_URL!,
	},
});
