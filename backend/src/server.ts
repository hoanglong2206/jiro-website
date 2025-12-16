import express, { Express } from "express";
import { App } from "./app";

class Server {
	public start(): void {
		const app: Express = express();
		const application: App = new App(app);
		application.start();
	}
}

const server: Server = new Server();
server.start();
