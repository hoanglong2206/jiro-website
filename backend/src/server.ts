import express, { Express } from "express";
import { dbConnection } from "./database";
import { App } from "./app";

class Server {
	public start(): void {
		const app: Express = express();
		const application: App = new App(app);
		dbConnection();
		application.start();
	}
}

const server: Server = new Server();
server.start();
