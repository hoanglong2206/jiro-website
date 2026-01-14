import { Application } from "express";
import { authRoutes } from "./routes/auth.route";
import { userRoutes } from "./routes/user.route";
import { projectRoutes } from "./routes/project.route";

const BASE_API = "/api";
export const appRoutes = (app: Application) => {
	app.get("/", (_req, res) => {
		res.status(200).send("API is running...");
	});

	app.use(`${BASE_API}/auth`, authRoutes.routes());
	app.use(`${BASE_API}/user`, userRoutes.routes());
	app.use(`${BASE_API}/project`, projectRoutes.routes());
};
