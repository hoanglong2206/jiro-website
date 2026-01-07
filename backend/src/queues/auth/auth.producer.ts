import { Channel } from "amqplib";
import { authConnection } from "./connection";

export async function publishDirectMessage(
	channel: Channel,
	exchangeName: string,
	routingKey: string,
	message: string,
	logMessage: string
): Promise<void> {
	try {
		if (!channel) {
			channel = (await authConnection()) as Channel;
		}
		await channel.assertExchange(exchangeName, "direct");
		channel.publish(exchangeName, routingKey, Buffer.from(message));
		console.log(logMessage);
	} catch (error) {
		console.log(error);
	}
}
