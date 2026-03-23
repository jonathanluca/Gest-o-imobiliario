/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			colors: {
				primary: "#1E40AF", // Azul do seu logo
				secondary: "#64748B",
				success: "#22C55E",
				danger: "#EF4444",
				background: "#F8FAFC",
			},
		},
	},
	plugins: [],
};
