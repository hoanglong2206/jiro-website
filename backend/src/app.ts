import express, { Application, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cors from "cors";
import routes from "./routes";
import { StatusCodes } from "http-status-codes";
import { config } from "./config";

const app: Application = express();

// CORS
app.use(
	cors({
		origin: config.CORS_ORIGIN || "*",
		optionsSuccessStatus: 200,
		credentials: true,
	}),
);

// Security & Compression
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan("combined"));
app.use(compression());

// Body parsers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use("/api", routes);

app.use("/", (_req: Request, res: Response) => {
	res.send("Hello, World!");
});

// 404 handler
app.use((_req: Request, res: Response) => {
	res.status(StatusCodes.NOT_FOUND).json({ message: "Route not found" });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
	console.error(err.stack);
	res
		.status(StatusCodes.INTERNAL_SERVER_ERROR)
		.json({ message: "Internal Server Error" });
});

export default app;
