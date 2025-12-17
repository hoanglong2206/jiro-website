import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { IAuthPayload } from "../types/auth.interface";

export function verifyJWT(req: Request, res: Response, next: NextFunction) {
	try {
		const auth = req.headers.authorization;
		if (!auth || !auth.startsWith("Bearer ")) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		const token = auth.substring(7);
		const payload = jwt.verify(
			token,
			config.JWT_SECRET as string,
		) as IAuthPayload;
		req.currentUser = payload;
		return next();
	} catch (error) {
		return res.status(401).json({ message: "Unauthorized" });
	}
}

export function checkAuthenticated(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	if (!req.currentUser) {
		return res.status(401).json({ message: "Unauthorized" });
	}
	return next();
}
