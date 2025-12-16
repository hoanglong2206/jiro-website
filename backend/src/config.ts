import dotenv from "dotenv";

dotenv.config({});

class Config {
	public DATABASE_URL: string | undefined;
	public CORS_ORIGIN: string | undefined;
	public NODE_ENV: string | undefined;
	public PORT: string | number | undefined;
	public JWT_SECRET: string | undefined;
	public SESSION_SECRET: string | undefined;

	constructor() {
		this.DATABASE_URL = process.env.DATABASE_URL || "";
		this.CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
		this.NODE_ENV = process.env.NODE_ENV || "development";
		this.PORT = process.env.PORT || 5001;
		this.JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";
		this.SESSION_SECRET =
			process.env.SESSION_SECRET || "default_session_secret";
	}
}

export const config: Config = new Config();
