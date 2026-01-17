import {
	pgEnum,
	pgTable,
	uuid,
	varchar,
	text,
	timestamp,
	integer,
} from "drizzle-orm/pg-core";

export const projectTypeEnum = pgEnum("project_type", ["work", "personal"]);
export const projectMemberRoleEnum = pgEnum("project_member_role", [
	"owner",
	"admin",
	"member",
	"viewer",
]);
export const projectAccessLevelEnum = pgEnum("project_access_level", [
	"private",
	"public",
]);

export const projectTable = pgTable("project", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: varchar("name", { length: 120 }).notNull(),
	description: text("description"),
	type: projectTypeEnum("type").notNull(),
	accessLevel: projectAccessLevelEnum("access_level").notNull(),
	ownerId: uuid("owner_id").notNull(),
	icon: varchar("icon"),
	color: varchar("color"),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date()),
});

export const projectMembersTable = pgTable("project_members", {
	id: uuid("id").primaryKey().defaultRandom(),
	projectId: uuid("project_id")
		.notNull()
		.references(() => projectTable.id, { onDelete: "cascade" }),
	userId: uuid("user_id").notNull(),
	userEmail: varchar("user_email", { length: 255 }),
	userFullname: varchar("user_fullname", { length: 255 }),
	userColorAvatar: varchar("user_color_avatar"),
	userProfilePicture: text("user_profile_picture"),
	role: projectMemberRoleEnum("role").notNull(), // 'owner', 'admin', 'member', 'viewer'
	invitedBy: uuid("invited_by"),
	joinedAt: timestamp("joined_at").defaultNow().notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date()),
});

export const workspaces = pgTable("workspaces", {
	id: uuid("id").primaryKey().defaultRandom(),
	projectId: uuid("project_id")
		.notNull()
		.references(() => projectTable.id, { onDelete: "cascade" }),
	name: varchar("name", { length: 255 }).notNull(),
	key: varchar("key", { length: 255 }).notNull(),
	color: varchar("color", { length: 50 }),
	createdBy: uuid("created_by").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date()),
});

export const boards = pgTable("boards", {
	id: uuid("id").primaryKey().defaultRandom(),
	workspaceId: uuid("workspace_id")
		.notNull()
		.references(() => workspaces.id, { onDelete: "cascade" }),
	projectId: uuid("project_id")
		.notNull()
		.references(() => projectTable.id, { onDelete: "cascade" }), // Denormalized for easier queries
	name: varchar("name", { length: 255 }).notNull(),
	color: varchar("color", { length: 50 }),
	position: integer("position").default(0),
	createdBy: uuid("created_by").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date()),
});

export type ProjectRecord = typeof projectTable.$inferSelect;
export type NewProjectRecord = typeof projectTable.$inferInsert;
export type ProjectMemberRecord = typeof projectMembersTable.$inferSelect;
export type NewProjectMemberRecord = typeof projectMembersTable.$inferInsert;
export type WorkspaceRecord = typeof workspaces.$inferSelect;
export type NewWorkspaceRecord = typeof workspaces.$inferInsert;
export type BoardRecord = typeof boards.$inferSelect;
export type NewBoardRecord = typeof boards.$inferInsert;
