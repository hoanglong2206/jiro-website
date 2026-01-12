export interface IFriendShips {
	id?: string;
	userId?: string;
	friendId?: string;
	createdAt?: Date;
}

export interface IFriendRequests {
	id?: string;
	senderId?: string;
	receiverId?: string;
	status?: "pending" | "accepted" | "rejected" | "cancelled";
	message?: string;
	updatedAt?: Date;
	respondedAt?: Date;
}
