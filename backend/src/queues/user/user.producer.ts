import { Channel } from "amqplib";
import { userConnection } from "./connection";

export async function publishDirectMessage(
	channel: Channel,
	exchangeName: string,
	routingKey: string,
	message: string,
	logMessage: string
): Promise<void> {
	try {
		if (!channel) {
			channel = (await userConnection()) as Channel;
		}
		await channel.assertExchange(exchangeName, "direct");
		channel.publish(exchangeName, routingKey, Buffer.from(message));
		console.log(logMessage);
	} catch (error) {
		console.log(error);
	}
}
