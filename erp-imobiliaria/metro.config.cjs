const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro-config");

// Em vez de usar caminhos absolutos que quebram no Windows Node 20,
// usamos uma referência relativa segura.
const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, {
	input: "./global.css",
	// Força o Metro a não usar a resolução de módulos ESM para o config
	projectRoot: __dirname,
});
