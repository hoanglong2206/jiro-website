export interface User {
	id: string;
	name: string;
	email: string;
	avatar: string;
}

export enum TaskStatus {
	TODO = "TO DO",
	IN_PROGRESS = "IN PROGRESS",
	IN_REVIEW = "IN REVIEW",
	DONE = "DONE",
}

export interface Task {
	id: string;
	key: string;
	title: string;
	description?: string;
	status: "todo" | "in-progress" | "in-review" | "done";
	type: "task" | "epic" | "story";
	assignee?: User;
	reporter?: User;
	dueDate?: string;
	startDate?: string;
	createdAt: string;
	updatedAt: string;
	projectId: string;
	parentTask?: {
		id: string;
		key: string;
		title: string;
	};
	subtasks?: {
		id: string;
		key: string;
		title: string;
		status: "todo" | "in-progress" | "in-review" | "done";
	}[];
	linkedItems?: {
		id: string;
		key: string;
		title: string;
		type: "blocks" | "is-blocked-by" | "relates-to";
	}[];
	comments?: {
		id: string;
		user: User;
		content: string;
		createdAt: string;
	}[];
}

export interface Project {
	id: string;
	name: string;
	key: string;
	description?: string;
	icon: string;
	color: string;
	lead?: User;
	members: User[];
}

export const users: User[] = [
	{
		id: "1",
		name: "John Doe",
		email: "john@example.com",
		avatar: "/logo.svg",
	},
	{
		id: "2",
		name: "Jane Smith",
		email: "jane@example.com",
		avatar: "/logo.svg",
	},
	{
		id: "3",
		name: "Bob Wilson",
		email: "bob@example.com",
		avatar: "/logo.svg",
	},
	{
		id: "4",
		name: "Alice Brown",
		email: "alice@example.com",
		avatar: "/logo.svg",
	},
];

export const projects: Project[] = [
	{
		id: "1",
		name: "Billing System Dev",
		key: "BSD",
		description: "Development of the billing system",
		icon: "💳",
		color: "#6366f1",
		lead: users[0],
		members: users,
	},
	{
		id: "2",
		name: "My Software Team",
		key: "MST",
		description: "Main software development team",
		icon: "👥",
		color: "#22c55e",
		lead: users[1],
		members: [users[0], users[1], users[2]],
	},
	{
		id: "3",
		name: "Marketing Campaign",
		key: "MKT",
		description: "Q1 Marketing initiatives",
		icon: "📢",
		color: "#f59e0b",
		lead: users[2],
		members: [users[2], users[3]],
	},
];

export const tasks: Task[] = [
	{
		id: "1",
		key: "BSD-1",
		title: "Set Up Notifications for Users",
		description:
			"Implement push notifications system for user alerts.\n\nThis task includes:\n• Setting up Firebase Cloud Messaging\n• Creating notification templates\n• Implementing notification preferences",
		status: "todo",
		type: "task",
		assignee: users[0],
		reporter: users[1],
		dueDate: "2025-12-27",
		createdAt: "2025-12-01",
		updatedAt: "2025-12-15",
		projectId: "1",
		comments: [
			{
				id: "c1",
				user: users[1],
				content: "Let's prioritize this for the next sprint",
				createdAt: "2025-12-10",
			},
		],
	},
	{
		id: "2",
		key: "BSD-2",
		title: "Develop Transaction History Feature",
		description:
			"Create a comprehensive transaction history view with filtering and export capabilities.",
		status: "todo",
		type: "task",
		assignee: users[1],
		reporter: users[0],
		dueDate: "2025-12-24",
		createdAt: "2025-12-02",
		updatedAt: "2025-12-14",
		projectId: "1",
	},
	{
		id: "3",
		key: "BSD-3",
		title: "Optimize Performance of the Application",
		description:
			"Improve loading times and reduce bundle size.\n\nFocus areas:\n• Code splitting\n• Image optimization\n• Caching strategies",
		status: "todo",
		type: "task",
		assignee: users[2],
		reporter: users[0],
		dueDate: "2025-12-26",
		createdAt: "2025-12-03",
		updatedAt: "2025-12-13",
		projectId: "1",
	},
	{
		id: "4",
		key: "BSD-4",
		title: "Create Wallet Integration",
		description:
			"Integrating a cryptocurrency wallet is essential for users to manage their assets. This task includes:\n\n• Researching wallet APIs.\n• Implementing wallet connection features.\n• Testing wallet transactions.\n\nThe integration should support multiple cryptocurrencies and ensure that transactions are secure and efficient.",
		status: "in-progress",
		type: "task",
		assignee: undefined,
		reporter: users[1],
		dueDate: "2025-12-24",
		createdAt: "2025-12-04",
		updatedAt: "2025-12-12",
		projectId: "1",
		subtasks: [],
		linkedItems: [],
	},
	{
		id: "5",
		key: "BSD-5",
		title: "Finalize Documentation for the Project",
		description: "Complete all technical and user documentation",
		status: "in-review",
		type: "task",
		assignee: users[0],
		reporter: users[2],
		dueDate: "2025-12-20",
		createdAt: "2025-12-05",
		updatedAt: "2025-12-11",
		projectId: "1",
	},
	{
		id: "6",
		key: "BSD-6",
		title: "Implement Payment Gateway",
		description: "Set up Stripe integration for payments",
		status: "done",
		type: "task",
		assignee: users[1],
		reporter: users[0],
		dueDate: "2025-12-18",
		createdAt: "2025-12-01",
		updatedAt: "2025-12-18",
		projectId: "1",
	},
	{
		id: "7",
		key: "BSD-7",
		title: "Design User Dashboard",
		description: "Create mockups for the main dashboard",
		status: "done",
		type: "task",
		assignee: users[3],
		reporter: users[2],
		dueDate: "2025-12-15",
		createdAt: "2025-11-28",
		updatedAt: "2025-12-15",
		projectId: "1",
	},
	{
		id: "8",
		key: "MST-1",
		title: "Setup CI/CD Pipeline",
		description: "Configure GitHub Actions for automated deployments",
		status: "in-progress",
		type: "task",
		assignee: users[0],
		reporter: users[1],
		dueDate: "2025-12-30",
		createdAt: "2025-12-10",
		updatedAt: "2025-12-15",
		projectId: "2",
	},
];
