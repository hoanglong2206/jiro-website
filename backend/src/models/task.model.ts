import {
	boolean,
	index,
	pgTable,
	uuid,
	varchar,
	text,
	timestamp,
	integer,
} from "drizzle-orm/pg-core";

export const tasks = pgTable(
	"tasks",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		boardId: uuid("board_id").notNull(), // Reference to project service
		projectId: uuid("project_id").notNull(), // Denormalized
		title: varchar("title", { length: 500 }).notNull(),
		description: text("description"),
		position: integer("position").default(0),
		priority: varchar("priority", { length: 20 }).default("medium"),
		status: varchar("status", { length: 50 }).default("todo"),
		dueDate: timestamp("due_date"),
		startDate: timestamp("start_date"),
		createdBy: uuid("created_by").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => [
		index("tasks_board_id_idx").on(table.boardId),
		index("tasks_project_id_idx").on(table.projectId),
	],
);

export const taskAssignees = pgTable(
	"task_assignees",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		taskId: uuid("task_id")
			.notNull()
			.references(() => tasks.id, { onDelete: "cascade" }),
		userId: uuid("user_id").notNull(),
		userEmail: varchar("user_email", { length: 255 }),
		userFullname: varchar("user_fullname", { length: 255 }),
		userProfilePicture: text("user_profile_picture"),
		assignedBy: uuid("assigned_by").notNull(),
		assignedAt: timestamp("assigned_at").defaultNow().notNull(),
	},
	(table) => [
		index("task_assignees_task_id_idx").on(table.taskId),
		index("task_assignees_user_id_idx").on(table.userId),
	],
);

export const taskComments = pgTable(
	"task_comments",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		taskId: uuid("task_id")
			.notNull()
			.references(() => tasks.id, { onDelete: "cascade" }),
		userId: uuid("user_id").notNull(),
		userFullname: varchar("user_fullname", { length: 255 }),
		userProfilePicture: text("user_profile_picture"),
		content: text("content").notNull(),
		parentId: uuid("parent_id"),
		isEdited: boolean("is_edited").default(false),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => [
		index("task_comments_task_id_idx").on(table.taskId),
		index("task_comments_user_id_idx").on(table.userId),
	],
);
