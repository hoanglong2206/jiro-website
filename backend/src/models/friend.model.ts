import { sql } from "drizzle-orm";
import {
	check,
	index,
	pgEnum,
	pgTable,
	text,
	timestamp,
	unique,
	uuid,
} from "drizzle-orm/pg-core";

export const friendRequestStatusEnum = pgEnum("friend_request_status", [
	"pending",
	"accepted",
	"rejected",
	"cancelled",
]);

export const friendRequests = pgTable(
	"friend_requests",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		senderId: uuid("sender_id").notNull(),
		receiverId: uuid("receiver_id").notNull(),
		status: friendRequestStatusEnum("status").default("pending").notNull(),
		message: text("message"),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		respondedAt: timestamp("responded_at", { withTimezone: true }),
	},
	(table) => [
		index("idx_friend_requests_sender").on(table.senderId),
		index("idx_friend_requests_receiver").on(table.receiverId),
		index("idx_friend_requests_status").on(table.status),
		unique("unique_pending_request").on(
			table.senderId,
			table.receiverId,
			table.status,
		),
		check("no_self_request", sql`${table.senderId} != ${table.receiverId}`),
	],
);

export const friendships = pgTable(
	"friendships",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		userId: uuid("user_id").notNull(),
		friendId: uuid("friend_id").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		index("idx_friendships_user").on(table.userId),
		index("idx_friendships_friend").on(table.friendId),
		unique("unique_friendship").on(table.userId, table.friendId),
		check("no_self_friendship", sql`${table.userId} != ${table.friendId}`),
	],
);
