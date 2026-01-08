import { Channel } from "amqplib";
import { createQueueChannel } from "../connection";

async function userConnection(): Promise<Channel> {
	return createQueueChannel({ logContext: "User server" });
}

export { userConnection };
