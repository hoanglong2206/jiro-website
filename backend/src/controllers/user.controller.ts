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

	async getAllUsers(_req: Request, res: Response) {
		try {
			const users = await userService.getAllUsers();
			return res.status(StatusCodes.OK).json({ users });
		} catch (error: any) {
			return res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ message: error.message });
		}
	}

	async updateUser(req: Request, res: Response) {
		if (!req.currentUser) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Unauthorized" });
		}

		try {
			const { userId } = req.params;
			if (req.currentUser.id !== userId) {
				return res
					.status(StatusCodes.FORBIDDEN)
					.json({ message: "Access denied" });
			}

			const { fullname, profilePicture, colorAvatar, jobTitle } = req.body;
			const user = await userService.updateUser(userId, {
				fullname,
				profilePicture,
				colorAvatar,
				jobTitle,
			});

			return res.status(StatusCodes.OK).json({
				message: "Profile updated successfully",
				user,
			});
		} catch (error: any) {
			const message = error?.message || "Unable to update user";
			const status =
				message === "User not found"
					? StatusCodes.NOT_FOUND
					: StatusCodes.BAD_REQUEST;
			return res.status(status).json({ message });
		}
	}
}

export default new UserController();
