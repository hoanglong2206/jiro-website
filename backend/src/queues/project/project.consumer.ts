import { Channel, ConsumeMessage, Replies } from "amqplib";
import { projectConnection } from "./connection";
import { projectService } from "../../services/project.service";

interface OwnerUpdateMessage {
	type?: string;
	userId?: string;
	fullname?: string | null;
	email?: string | null;
	profilePicture?: string | null;
	colorAvatar?: string | null;
}

const exchangeName = "project.owner";
const queueName = "project.owner.update.queue";
const routingKey = "owner.updated";

export async function consumeProjectMessages(channel?: Channel): Promise<void> {
	try {
		if (!channel) {
			channel = await projectConnection();
		}

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
			if (!msg) {
				return;
			}

			try {
				const payload = JSON.parse(
					msg.content.toString(),
				) as OwnerUpdateMessage;

				if (payload.type !== "project.owner.update" || !payload.userId) {
					return;
				}

				await projectService.updateOwnerDetailsForUser({
					userId: payload.userId,
					fullname: payload.fullname ?? undefined,
					email: payload.email ?? undefined,
					profilePicture: payload.profilePicture ?? undefined,
					colorAvatar: payload.colorAvatar ?? undefined,
				});
			} catch (error) {
				console.error("Failed to process project owner update message:", error);
			} finally {
				channel!.ack(msg);
			}
		});
	} catch (error) {
		console.error("Error initializing project owner consumer:", error);
	}
}
