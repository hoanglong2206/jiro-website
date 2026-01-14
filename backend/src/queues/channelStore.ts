import { Channel } from "amqplib";

let authChannelRef: Channel | undefined;
let userChannelRef: Channel | undefined;

export function setAuthChannel(channel: Channel): void {
	authChannelRef = channel;
}

export function getAuthChannel(): Channel | undefined {
	return authChannelRef;
}

export function setUserChannel(channel: Channel): void {
	userChannelRef = channel;
}

export function getUserChannel(): Channel | undefined {
	return userChannelRef;
}
