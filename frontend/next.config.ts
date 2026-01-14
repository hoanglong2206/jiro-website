import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	// output: "export",
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn-icons-png.flaticon.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "i.pravatar.cc",
				port: "",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
