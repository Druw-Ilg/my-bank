// URLs for Development and Production environment
const dev = process.env.NODE_ENV !== "production";

export const server = dev
	? "http://localhost:3000"
	: "https://andruwilagou.com";
