import { Channel } from "amqplib";

let authChannelRef: Channel | undefined;
let userChannelRef: Channel | undefined;
let friendChannelRef: Channel | undefined;

export function setFriendChannel(channel: Channel): void {
	friendChannelRef = channel;
}

export function getFriendChannel(): Channel | undefined {
	return friendChannelRef;
}

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
