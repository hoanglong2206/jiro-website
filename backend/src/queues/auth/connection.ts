import { Channel } from "amqplib";
import { createQueueChannel } from "../connection";

async function authConnection(): Promise<Channel> {
	return createQueueChannel({ logContext: "Auth server" });
}

export { authConnection };
