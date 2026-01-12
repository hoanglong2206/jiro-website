import { Channel } from "amqplib";
import { createQueueChannel } from "../connection";

async function friendConnection(): Promise<Channel> {
	return createQueueChannel({ logContext: "Friend server" });
}

export { friendConnection };
