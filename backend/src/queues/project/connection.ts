import { Channel } from "amqplib";
import { createQueueChannel } from "../connection";

async function projectConnection(): Promise<Channel> {
	return createQueueChannel({ logContext: "Project server" });
}

export { projectConnection };
