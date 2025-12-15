import dotenv from "dotenv";

dotenv.config({});

class Config {
	public DATABASE_URL: string | undefined;
	public CORS_ORIGIN: string | undefined;
	public PORT: string | number | undefined;

	constructor() {
		this.DATABASE_URL = process.env.DATABASE_URL || "";
		this.CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
		this.PORT = process.env.PORT || 5001;
	}
}

export const config: Config = new Config();
