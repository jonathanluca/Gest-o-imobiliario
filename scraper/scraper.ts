import { chromium } from "playwright-extra";
import stealth from "puppeteer-extra-plugin-stealth";
// scraper/scraper.ts
import { prisma } from "../erp-imobiliario-api/src/lib/prisma";

chromium.use(stealth());

async function runScraper() {
	console.log("🚀 Iniciando Scraper e Integração com Banco de Dados...");

	const browser = await chromium.launch({ headless: true });
	let context = await browser.newContext({
		userAgent:
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
	});
	const page = await context.newPage();

	const listUrl =
		"https://www.netimoveis.com/venda/sao-paulo/sao-paulo/casa?transacao=venda&localizacao=BR-SP-sao-paulo---&tipo=apartamento%2Ccasa&pagina=35";

	const paginasParaProcessar = 1000; // Defina quantas páginas você quer percorrer

	try {
		for (let p = 50; p <= paginasParaProcessar; p++) {
			console.log(`\n📄 --- PROCESSANDO PÁGINA ${p} ---`);

			const page = await context.newPage();
			// A URL muda apenas o número final
			const listUrl = `https://www.netimoveis.com/venda/sao-paulo/sao-paulo/casa?transacao=venda&localizacao=BR-SP-sao-paulo---&tipo=apartamento%2Ccasa&pagina=${p}`;

			try {
				await page.goto(listUrl, {
					waitUntil: "networkidle",
					timeout: 60000,
				});

				const links = await page.evaluate(() => {
					const anchors = Array.from(
						document.querySelectorAll('a[href*="/imovel/"]'),
					);
					return [
						...new Set(anchors.map((a) => (a as HTMLAnchorElement).href)),
					];
				});

				console.log(`🔎 Encontrados ${links.length} links na página ${p}.`);

				for (const link of links.slice(0, 10)) {
					if (p % 10 === 0) {
						// A cada 10 páginas, por exemplo
						console.log(
							"🧼 Limpando contexto e cookies para evitar rastreamento...",
						);
						await context.close();
						context = await browser.newContext({
							userAgent:
								"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...",
						});
					}

					const detailPage = await context.newPage();
					try {
						await detailPage.goto(link, {
							waitUntil: "domcontentloaded",
							timeout: 60000,
						});
						await detailPage.waitForTimeout(4000);

						const rawData = await detailPage.evaluate(() => {
							const addressEl = document.querySelector(
								".re-location, [class*='Address'], .location-city, h1 + p",
							);
							const descEl = document.querySelector(
								'[data-testid="description-content"], .texto-descricao, [class*="Description"]',
							);

							const images = Array.from(
								document.querySelectorAll(
									'img[src*="netimoveis"], .swiper-slide img, [class*="Gallery"] img',
								),
							)
								.map(
									(img) =>
										(img as HTMLImageElement).getAttribute(
											"data-src",
										) || (img as HTMLImageElement).src,
								)
								.filter(
									(src) =>
										src &&
										src.startsWith("http") &&
										!src.match(
											/(logo|icon|avatar|staff|google|marker)/i,
										),
								);

							return {
								title:
									document.querySelector("h1")?.innerText.trim() ||
									document.title.split("|")[0].trim(),
								pageText: document.body.innerText,
								description:
									descEl?.textContent?.replace(/\s+/g, " ").trim() ||
									"",
								address: addressEl?.textContent?.trim() || "",
								images: [...new Set(images)] as string[],
							};
						});

						// Formatação e Inserção no Prisma
						const formatted = formatData(rawData);

						// Inserindo no banco de dados conforme o schema.prisma
						// 103: Substitua o .create pelo .upsert
						const savedProperty = await prisma.property.upsert({
							where: {
								link_post: link, // Critério único para verificar se já existe
							},
							update: {
								// Se o imóvel já existir, atualizamos apenas o preço e a descrição
								price: formatted.price,
								description: formatted.description,
								images: formatted.images,
								status: "Disponível",
							},
							create: {
								// Se o imóvel NÃO existir, ele cria o registro completo
								title: formatted.title,
								type: formatted.type,
								status: "Disponível",
								address: formatted.address,
								city: "Campinas",
								state: "SP",
								area: formatted.area,
								bedrooms: formatted.bedrooms,
								suites: formatted.suites,
								bathrooms: formatted.bathrooms,
								parking_spots: formatted.parking_spots,
								price: formatted.price,
								link_post: link, // O link que causou o erro agora serve de ID
								description: formatted.description,
								images: formatted.images,
							},
						});

						console.log(
							`✅ Salvo no Banco: ${savedProperty.title} (ID: ${savedProperty.id})`,
						);
					} catch (err) {
						console.error(`❌ Erro ao processar/salvar: ${link}`, err);
					} finally {
						await detailPage.close();
					}
					await new Promise((r) => setTimeout(r, 1000));
				}
			} catch (err) {
				console.error(`❌ Erro ao processar a lista da página ${p}:`, err);
			} finally {
				await page.close(); // Fecha a aba da lista antes de ir para a próxima página
			}
		}
	} finally {
		await browser.close();
		await prisma.$disconnect();
		console.log("🏁 Scraper finalizado e desconectado do banco.");
	}
}

// Função auxiliar para tratar os tipos do Prisma (Decimal, Int, etc)
function formatData(raw: any) {
	const text = raw.pageText;
	const extractNum = (regex: RegExp) => {
		const match = text.match(regex);
		return match ? parseInt(match[1]) : 0;
	};

	// Preço e Área precisam ser convertidos para compatibilidade com Decimal do Prisma
	const priceMatch = text.match(/R\$\s?([\d.]+)/);
	const priceValue = priceMatch ? priceMatch[1].replace(/\./g, "") : "0";

	const areaMatch = text.match(/([\d.]+)\s*m²/i);
	const areaValue = areaMatch ? areaMatch[1].replace(/\./g, "") : "0";

	return {
		title: raw.title,
		type: raw.title.toLowerCase().includes("casa") ? "Casa" : "Apartamento",
		address: raw.address || "Campinas, SP",
		area: areaValue, // Prisma converterá string para Decimal
		price: priceValue, // Prisma converterá string para Decimal[cite: 1]
		bedrooms: extractNum(/(\d+)\s*quarto/i),
		suites: extractNum(/(\d+)\s*suíte/i),
		bathrooms:
			extractNum(/(\d+)\s*banheiro/i) || extractNum(/(\d+)\s*banho/i),
		parking_spots: extractNum(/(\d+)\s*vaga/i),
		description: raw.description,
		images: raw.images.slice(0, 15),
	};
}

runScraper();
