import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { userService } from "../services/user.service";

class UserController {
	async getUserByEmail(req: Request, res: Response) {
		try {
			const email = req.params.email;
			const user = await userService.getUserByEmail(email);
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found" });
			}
			return res.status(StatusCodes.OK).json({ user });
		} catch (error: any) {
			return res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ message: error.message });
		}
	}

	async getUserByUsername(req: Request, res: Response) {
		try {
			const username = req.params.username;
			const user = await userService.getUserByUsername(username);
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found" });
			}
			return res.status(StatusCodes.OK).json({ user });
		} catch (error: any) {
			return res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ message: error.message });
		}
	}

	async getAllUsers(req: Request, res: Response) {
		try {
			const users = await userService.getAllUsers();
			return res.status(StatusCodes.OK).json({ users });
		} catch (error: any) {
			return res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ message: error.message });
		}
	}
}

export default new UserController();
