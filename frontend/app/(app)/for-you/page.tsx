"use client";

import { useState } from "react";
import {
	Users,
	ChevronDown,
	UsersRound,
	Warehouse,
	Lock,
	LockOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CustomModal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuItem,
	DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
	IProjectResponse,
	ProjectAcessLevel,
	ProjectType,
} from "@/types/project.interface";
import { Textarea } from "@/components/ui/textarea";
import { mockProjects } from "@/lib/data";
import Image from "next/image";

export default function ForYouPage() {
	const [projects, setProjects] = useState<IProjectResponse[]>(mockProjects);
	const [notifications, setNotifications] = useState<any[]>([]);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	return (
		<>
			<div className="overflow-auto bg-background">
				<div className="mx-auto p-4 md:px-16">
					<h1 className="text-2xl font-semibold text-foreground">
						For you
					</h1>
					<hr className="my-4" />

					<div className="flex flex-col gap-2">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-lg font-medium text-foreground">
								Projects
							</h2>
							<div className="flex items-center gap-2">
								<Link
									href="/projects"
									className="text-sm text-primary hover:underline ml-2 hidden md:inline-block"
								>
									View all projects
								</Link>
							</div>
						</div>
						{projects.length === 0 ? (
							<div className="flex flex-col items-center justify-center gap-3">
								<h2 className="text-lg font-medium text-foreground">
									No projects found
								</h2>
								<span className="text-sm text-muted-foreground italic">
									You have no recently viewed projects.
								</span>
								<button
									onClick={() => setIsModalOpen(true)}
									className="px-3 py-1.5 text-sm rounded-md transition-colors border cursor-pointer border-primary text-primary hover:bg-primary/10"
								>
									Create new project
								</button>
							</div>
						) : (
							<div className="flex gap-4 overflow-auto py-1">
								{projects.map((project) => (
									<ProjectCard
										key={project.id}
										project={project}
									/>
								))}
							</div>
						)}
					</div>
					<div className="space-y-1 mt-4">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-lg font-medium text-foreground">
								Notification
							</h2>
							<div className="flex items-center gap-2">
								<Link
									href="/notifications"
									className="text-sm text-primary hover:underline ml-2 hidden md:inline-block"
								>
									View all notifications
								</Link>
							</div>
						</div>
						{notifications.length === 0 ? (
							<h2 className="text-lg font-medium text-foreground text-center">
								You no have any notifications
							</h2>
						) : (
							<div className="flex gap-4 overflow-auto py-1"></div>
						)}
					</div>
				</div>
			</div>
			<CreateProjectModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</>
	);
}

const ProjectCard = ({ project }: { project: IProjectResponse }) => {
	return (
		<Link
			href={`/projects/${project.id}/home`}
			className="shrink-0 w-64 rounded-sm flex flex-col justify-between border-l-24 border-l-primary py-1 space-y-1 hover:shadow-md transition-shadow"
		>
			<div className="flex items-start gap-2 px-2.5">
				<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-400">
					<Image
						src={project.icon}
						alt={project.name}
						width={15}
						height={15}
					/>
				</div>
				<div className="min-w-0">
					<h3 className="font-medium truncate">{project.name}</h3>
					<p className="text-xs text-muted-foreground italic capitalize">
						{project.type}
					</p>
				</div>
			</div>

			<div className="px-2.5">
				<p className="text-xs font-medium text-muted-foreground">
					Quick links
				</p>
				<div className="flex items-center justify-between text-xs  transition-colors">
					<span>My open work items</span>
					<Badge
						variant="secondary"
						className="bg-primary/20 size-5 rounded-full"
					>
						8
					</Badge>
				</div>
				<div className="flex items-center text-xs transition-colors">
					<span>Done work items</span>
				</div>
			</div>

			<div className="border-t border-border px-2.5 flex items-center justify-between pt-0.5">
				<button className="flex items-center py-0.5 px-1.5 rounded-md gap-1 text-xs transition-colors hover:bg-muted/90 cursor-pointer">
					<span>1 workspace</span>
					<ChevronDown className="h-3 w-3" />
				</button>
			</div>
		</Link>
	);
};

const CreateProjectModal = ({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) => {
	const [nameProject, setNameProject] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [typeProject, setTypeProject] = useState<ProjectType>("personal");
	const [accessLevel, setAccessLevel] =
		useState<ProjectAcessLevel>("private");

	const handleAddProject = (e: React.FormEvent) => {
		e.preventDefault();

		console.log({
			nameProject,
			description,
			typeProject,
			accessLevel,
		});
	};
	return (
		<CustomModal open={isOpen} onClose={onClose} size="xl:min-w-lg">
			<div className="flex h-full flex-col gap-8 px-4">
				<h2 className="text-xl font-semibold">Add New Project</h2>
				<form className="space-y-6" onSubmit={handleAddProject}>
					<div className="space-y-1">
						<Label
							className="block text-sm font-medium mb-2"
							htmlFor="nameProject"
						>
							Name
							<span className="text-red-500 ml-1">*</span>
						</Label>
						<Input
							className="h-9"
							id="nameProject"
							value={nameProject}
							onChange={(e) => setNameProject(e.target.value)}
						/>
					</div>
					<div className="flex items-center justify-between">
						<div className="space-y-1">
							<Label
								className="block text-sm font-medium mb-2"
								htmlFor="typeProject"
							>
								Type
								<span className="text-red-500 ml-1">*</span>
							</Label>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										className={`px-4 py-1.5 cursor-pointer min-w-48 capitalize flex items-center justify-start gap-2`}
										variant={"secondary"}
										id="status"
									>
										{typeProject === "personal" ? (
											<UsersRound className="h-4 w-4" />
										) : (
											<Warehouse className="h-4 w-4" />
										)}
										{typeProject}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									className="z-9999 min-w-48 space-y-1"
									align="start"
								>
									<DropdownMenuItem
										className="cursor-pointer flex item-center gap-2 hover:bg-muted/90 transition-colors"
										onClick={() =>
											setTypeProject("personal")
										}
									>
										<UsersRound className="h-4 w-4" />
										Personal
									</DropdownMenuItem>
									<DropdownMenuItem
										className="cursor-pointer flex item-center gap-2 hover:bg-muted/90 transition-colors"
										onClick={() => setTypeProject("work")}
									>
										<Warehouse className="h-4 w-4" />
										Work
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
						<div className="space-y-1">
							<Label
								className="block text-sm font-medium mb-2"
								htmlFor="typeProject"
							>
								Access
								<span className="text-red-500 ml-1">*</span>
							</Label>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										className={`px-4 py-1.5 cursor-pointer min-w-48 capitalize flex items-center justify-start gap-2`}
										variant={"secondary"}
										id="status"
									>
										{accessLevel === "private" ? (
											<Lock className="h-4 w-4" />
										) : (
											<LockOpen className="h-4 w-4" />
										)}
										{accessLevel}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									className="z-9999 min-w-48 space-y-1"
									align="start"
								>
									<DropdownMenuItem
										className="cursor-pointer flex item-center gap-2 hover:bg-muted/90 transition-colors"
										onClick={() =>
											setAccessLevel("private")
										}
									>
										<Lock className="h-4 w-4" />
										Private
									</DropdownMenuItem>
									<DropdownMenuItem
										className="cursor-pointer flex item-center gap-2 hover:bg-muted/90 transition-colors"
										onClick={() => setAccessLevel("public")}
									>
										<LockOpen className="h-4 w-4" />
										Public
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
					<div className="space-y-1">
						<Label
							className="block text-sm font-medium mb-2"
							htmlFor="description"
						>
							Description
						</Label>
						<Textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>
					<div className="flex items-center justify-end">
						<Button
							className="gap-2 cursor-pointer flex w-full md:w-auto"
							type="submit"
						>
							Create
						</Button>
					</div>
				</form>
			</div>
		</CustomModal>
	);
};
