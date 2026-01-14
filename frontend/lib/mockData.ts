import { ProjectResponse } from "@/types/project.interface";
import { IUser } from "@/types/user.interface";

export const mockUsers: IUser[] = [
	{
		id: "user-001",
		fullname: "Alex Johnson",
		username: "alex_j",
		email: "alex.j@example.com",
		profilePicture: "https://i.pravatar.cc/150?u=user-001",
		colorAvatar: "#FF5733",
		jobTitle: "Software Engineer",
	},
	{
		id: "user-002",
		fullname: "Sarah Smith",
		username: "sarah_s",
		email: "sarah.s@example.com",
		profilePicture: null,
		colorAvatar: "#33FF57",
		jobTitle: "UI/UX Designer",
	},
	{
		id: "user-003",
		fullname: "Michael Brown",
		username: "michael_b",
		email: "michael.b@example.com",
		profilePicture: "https://i.pravatar.cc/150?u=user-003",
		colorAvatar: "#3357FF",
		jobTitle: "Product Manager",
	},
	{
		id: "user-123", // Current User
		fullname: "John Doe",
		username: "johndoe",
		email: "john.doe@example.com",
		profilePicture: "https://i.pravatar.cc/150?u=user-123",
		colorAvatar: "#4CAF50",
		jobTitle: "Senior Fullstack Developer",
	},
];

export const mockProjects: ProjectResponse[] = [
	{
		id: "proj-001",
		name: "HR Management System",
		description:
			"Internal software for managing employee records and payroll.",
		type: "work",
		lead: mockUsers[3],
		members: [mockUsers[1], mockUsers[2], mockUsers[0]],
		icon: "https://cdn-icons-png.flaticon.com/512/2942/2942789.png",
		createAt: new Date("2024-01-10T08:00:00Z"),
		updateAt: new Date("2024-03-15T10:30:00Z"),
	},
	{
		id: "proj-002",
		name: "E-Commerce Mobile App",
		description:
			"Multi-vendor online shopping platform with payment integration.",
		type: "personal",
		lead: mockUsers[3],
		members: [mockUsers[0], mockUsers[1]],
		icon: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png",
		createAt: new Date("2024-02-01T09:00:00Z"),
		updateAt: new Date("2024-03-20T14:00:00Z"),
	},
	{
		id: "proj-003",
		name: "Corporate Website Redesign",
		description:
			"Modernizing the landing page with focus on UX and performance.",
		type: "work",
		lead: mockUsers[3],
		members: [mockUsers[2]],
		icon: "https://cdn-icons-png.flaticon.com/512/1055/1055666.png",
		createAt: new Date("2024-03-05T13:00:00Z"),
		updateAt: new Date("2024-03-18T16:45:00Z"),
	},
];
