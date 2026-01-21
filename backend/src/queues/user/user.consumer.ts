import { Channel, ConsumeMessage, Replies } from "amqplib";
import { userConnection } from "./connection";
import { userService } from "../../services/user.service";
import { IUser } from "../../types/user.interface";

const consumeUserMessage = async (channel: Channel): Promise<void> => {
	try {
		if (!channel) {
			channel = (await userConnection()) as Channel;
		}

		const exchangeName = "user.register";
		const queueName = "user.registration.queue";
		const routingKey = "user.create";

		await channel.assertExchange(exchangeName, "direct", {
			durable: true,
		});
		const assertedQueue: Replies.AssertQueue = await channel.assertQueue(
			queueName,
			{
				durable: true,
				autoDelete: false,
			},
		);
		await channel.bindQueue(assertedQueue.queue, exchangeName, routingKey);
		channel.consume(
			assertedQueue.queue,
			async (msg: ConsumeMessage | null) => {
				const { type, ...data } = msg
					? JSON.parse(msg.content.toString())
					: {};
				if (type === "auth") {
					const userPayload: IUser = {
						id: data.id,
						fullname: data.fullname,
						username: data.username,
						email: data.email,
						profilePicture: data.profilePicture,
						colorAvatar: data.colorAvatar,
						jobTitle: data.jobTitle,
					};

					await userService.createUser(userPayload);
				}
				channel.ack(msg!);
			},
		);
	} catch (error) {
		console.error("Error in user consumer:", error);
	}
};

export { consumeUserMessage };
