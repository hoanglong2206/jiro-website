import { Channel, ConsumeMessage, Replies } from "amqplib";
import { projectConnection } from "./connection";
import { projectService } from "../../services/project.service";
import { IUpdateProjectPayload } from "@/src/types/project.interface";

interface OwnerUpdateMessage {
	type?: string;
	userId?: string;
	fullname?: string | null;
	profilePicture?: string | null;
	colorAvatar?: string | null;
}

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
		channel.consume(
			assertedQueue.queue,
			async (msg: ConsumeMessage | null) => {
				const { type, ...data } = msg
					? JSON.parse(msg.content.toString())
					: {};

				if (type == "update-owner") {
					await projectService.updateOwnerDetailsForUser(
						data.userId,
						data.fullname,
						data.profilePicture,
						data.colorAvatar,
					);
				}
				channel.ack(msg!);
			},
		);
	} catch (error) {
		console.error("Error initializing project owner consumer:", error);
	}
}
