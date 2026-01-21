import { Channel, ConsumeMessage, Replies } from "amqplib";
import { projectConnection } from "./connection";
import { projectService } from "../../services/project.service";

export async function consumeProjectMessages(channel: Channel): Promise<void> {
	try {
		if (!channel) {
			channel = await projectConnection();
		}

		const exchangeName = "project.owner";
		const queueName = "project.user-update.queue";
		const routingKey = "project.update-owner";

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
		channel.consume(assertedQueue.queue, async (msg: ConsumeMessage | null) => {
			const { type, ...data } = msg ? JSON.parse(msg.content.toString()) : {};

			if (type == "update-owner") {
				await projectService.updateOwnerDetailsForUser({
					userId: data.userId,
					fullname: data.fullname,
					profilePicture: data.profilePicture,
					colorAvatar: data.colorAvatar,
				});
			}
			channel.ack(msg!);
		});
	} catch (error) {
		console.error("Error initializing project owner consumer:", error);
	}
}
