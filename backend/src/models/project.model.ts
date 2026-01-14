import {
	pgEnum,
	pgTable,
	primaryKey,
	uuid,
	varchar,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { userTable } from "./user.model";

export const projectTypeEnum = pgEnum("project_type", ["work", "personal"]);

export const projectTable = pgTable("project", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: varchar("name", { length: 120 }).notNull(),
	description: text("description"),
	type: projectTypeEnum("type").notNull(),
	leadId: uuid("lead_id")
		.notNull()
		.references(() => userTable.id, { onDelete: "cascade" }),
	icon: text("icon"),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date()),
});

export const projectMemberTable = pgTable(
	"project_member",
	{
		projectId: uuid("project_id")
			.notNull()
			.references(() => projectTable.id, { onDelete: "cascade" }),
		userId: uuid("user_id")
			.notNull()
			.references(() => userTable.id, { onDelete: "cascade" }),
		joinedAt: timestamp("joined_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.projectId, table.userId] }),
	}),
);

export const projectRelations = relations(projectTable, ({ one, many }) => ({
	lead: one(userTable, {
		fields: [projectTable.leadId],
		references: [userTable.id],
	}),
	members: many(projectMemberTable),
}));

export const projectMemberRelations = relations(
	projectMemberTable,
	({ one }) => ({
		project: one(projectTable, {
			fields: [projectMemberTable.projectId],
			references: [projectTable.id],
		}),
		member: one(userTable, {
			fields: [projectMemberTable.userId],
			references: [userTable.id],
		}),
	}),
);

export type ProjectRecord = typeof projectTable.$inferSelect;
export type NewProjectRecord = typeof projectTable.$inferInsert;
export type ProjectMemberRecord = typeof projectMemberTable.$inferSelect;
export type NewProjectMemberRecord = typeof projectMemberTable.$inferInsert;
