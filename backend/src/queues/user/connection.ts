import { config } from "../../config";
import client, { Channel, ChannelModel } from "amqplib";

async function userConnection(): Promise<Channel> {
	try {
		const connection: ChannelModel = await client.connect(
			`${config.RABBITMQ_ENDPOINT}`,
		);
		const channel: Channel = await connection.createChannel();
		console.log("User server connected to queue successfully...");
		closeConnection(channel, connection);
		return channel;
	} catch (error) {
		console.error("Failed to establish user queue connection:", error);
		throw error;
	}
}

function closeConnection(channel: Channel, connection: ChannelModel): void {
	process.once("SIGINT", async () => {
		await channel.close();
		await connection.close();
	});
}

export { userConnection };
