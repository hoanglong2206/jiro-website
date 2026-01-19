"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, Edit, X } from "lucide-react";
import { useGetProjectsQuery } from "@/services/project.service";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
	setProjects,
	setCurrentProject,
} from "@/store/reducers/project.reducer";
import { CreateProjectModal } from "@/components/app/CreateProjectModal";
import { IProjectResponse } from "@/types/project.interface";
import { saveToLocalStorage } from "@/services/utils.service";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function ForYouPage() {
	const dispatch = useAppDispatch();
	const { projects } = useAppSelector((state) => state.project);
	const { data, isFetching } = useGetProjectsQuery(undefined, {
		refetchOnMountOrArgChange: true,
	});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const notifications: unknown[] = [];

	console.log(data?.projects);
	const projectList = data?.projects
		? [...data.projects]
				.sort(
					(a, b) =>
						new Date(b.updatedAt).getTime() -
						new Date(a.updatedAt).getTime(),
				)
				.slice(0, 4)
		: projects;

	useEffect(() => {
		if (data?.projects) {
			dispatch(setProjects(data.projects));
		}
	}, [data?.projects, dispatch]);

	return (
		<>
			<div className="overflow-auto bg-background">
				<div className="mx-auto p-4 md:px-16">
					<h1 className="text-2xl font-semibold text-foreground">
						For you
					</h1>
					<hr className="my-4" />

					<div className="flex flex-col gap-2">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-lg font-medium text-foreground">
								Projects
							</h2>
							<div className="flex items-center gap-2">
								<Link
									href="/projects"
									className="ml-2 hidden text-sm text-primary hover:underline md:inline-block"
								>
									View all projects
								</Link>
							</div>
						</div>
						{isFetching && projectList.length === 0 ? (
							<ProjectsSkeleton />
						) : projectList.length === 0 ? (
							<div className="flex flex-col items-center justify-center gap-3">
								<h2 className="text-lg font-medium text-foreground">
									No projects found
								</h2>
								<span className="text-sm italic text-muted-foreground">
									You have no recently viewed projects.
								</span>
								<button
									onClick={() => setIsModalOpen(true)}
									className="cursor-pointer rounded-md border border-primary px-3 py-1.5 text-sm text-primary transition-colors hover:bg-primary/10"
								>
									Create new project
								</button>
							</div>
						) : (
							<div className="flex gap-4 overflow-auto py-1">
								{projectList.map((project) => (
									<ProjectCard
										key={project.id}
										project={project}
									/>
								))}
							</div>
						)}
					</div>

					<div className="mt-4 space-y-1">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-lg font-medium text-foreground">
								Notification
							</h2>
							<div className="flex items-center gap-2">
								<Link
									href="/notifications"
									className="ml-2 hidden text-sm text-primary hover:underline md:inline-block"
								>
									View all notifications
								</Link>
							</div>
						</div>
						{notifications.length === 0 ? (
							<h2 className="text-center text-lg font-medium text-foreground">
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

function ProjectCard({ project }: { project: IProjectResponse }) {
	const dispatch = useAppDispatch();
	const [isEditName, setIsEditName] = useState<boolean>(false);
	const [isEditDescription, setIsEditDescription] = useState<boolean>(false);
	const [description, setDescription] = useState<string | undefined>(
		project.description,
	);
	const [name, setName] = useState<string>(project.name);

	const isEditing = isEditName || isEditDescription;
	const cardContent = (
		<div
			className={cn(
				"flex justify-between shrink-0 flex-col px-4 py-3 transition-shadow  w-[384px] no-scrollbar",
				isEditDescription ? "h-48" : "h-40",
			)}
		>
			<div className="flex flex-col items-start gap-2">
				<div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-blue-400">
					{project.icon ? (
						<Image
							src={project.icon}
							alt={project.name}
							width={15}
							height={15}
						/>
					) : (
						<span className="text-xs font-semibold text-white">
							{project.name
								.split(" ")
								.map((x) => x[0])
								.join("")}
						</span>
					)}
				</div>
				<div className="flex-col flex gap-1 w-full">
					<div className="flex items-center gap-1">
						{isEditName ? (
							<div
								className="relative w-full"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation;
								}}
							>
								<Input
									value={name}
									onChange={(e) => {
										setName(e.target.value);
									}}
									placeholder={name}
								/>
								<div className="flex items-center gap-2 absolute -bottom-7.5 right-0">
									<Button
										onClick={() => {
											setIsEditName(false);
										}}
										size="icon"
										className="h-7 w-7 shadow-md bg-background text-foreground hover:bg-muted cursor-pointer"
									>
										<X className="h-3 w-3" />
									</Button>
									<Button
										onClick={() => {
											setIsEditName(false);
											setDescription(description);
										}}
										size="icon"
										className="h-7 w-7 shadow-md bg-background text-foreground hover:bg-muted cursor-pointer"
									>
										<Check className="h-3 w-3" />
									</Button>
								</div>
							</div>
						) : (
							<h3 className="truncate font-medium text-lg">
								{name}
							</h3>
						)}
						<Button
							onClick={(e) => {
								e.stopPropagation();
								e.preventDefault();
								setIsEditName(true);
							}}
							variant="ghost"
							size="icon"
							disabled={isEditing}
							className={cn(
								"h-6 w-6 hover:bg-sidebar-accent text-muted-foreground cursor-pointer",
								isEditName && "hidden",
							)}
						>
							<Edit className="h-3 w-3" />
						</Button>
					</div>
					<div className="flex items-center gap-1">
						{isEditDescription ? (
							<div
								className="relative w-full"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation;
								}}
							>
								<Textarea
									value={description ?? ""}
									onChange={(e) => {
										setDescription(e.target.value);
									}}
									placeholder={
										description ?? "Add a description"
									}
								/>
								<div className="flex items-center gap-2 absolute -bottom-7.5 left-0">
									<Button
										onClick={() => {
											setIsEditDescription(false);
										}}
										size="icon"
										className="h-7 w-7 shadow-md bg-background text-foreground hover:bg-muted cursor-pointer"
									>
										<X className="h-3 w-3" />
									</Button>
									<Button
										onClick={() => {
											setIsEditDescription(false);
											setDescription(description);
										}}
										size="icon"
										className="h-7 w-7 shadow-md bg-background text-foreground hover:bg-muted cursor-pointer"
									>
										<Check className="h-3 w-3" />
									</Button>
								</div>
							</div>
						) : (
							<p className="text-sm italic capitalize text-muted-foreground">
								{description || "No description"}
							</p>
						)}
						<Button
							onClick={(e) => {
								e.stopPropagation();
								e.preventDefault();
								setIsEditDescription(true);
							}}
							variant="ghost"
							size="icon"
							disabled={isEditing}
							className={cn(
								"h-6 w-6 hover:bg-sidebar-accent text-muted-foreground cursor-pointer",
								isEditDescription && "hidden",
							)}
						>
							<Edit className="h-3 w-3" />
						</Button>
					</div>
				</div>
			</div>
			<div className="flex items-center justify-end">
				<p className="text-sm italic capitalize text-muted-foreground">
					{project.type}
				</p>
			</div>
		</div>
	);

	return (
		<>
			{isEditing ? (
				<div className="border rounded-md">{cardContent}</div>
			) : (
				<Link
					onClick={() => {
						dispatch(setCurrentProject(project));
						saveToLocalStorage(
							"currentProject",
							JSON.stringify(project),
						);
					}}
					href={`/projects/${project.id}/home`}
					className="hover:shadow-md rounded-md border"
				>
					{cardContent}
				</Link>
			)}
		</>
	);
}

function ProjectsSkeleton() {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 overflow-auto py-1">
			{Array.from({ length: 3 }).map((_, index) => (
				<div
					key={index}
					className="flex justify-between shrink-0 h-40 border flex-col rounded-lg px-4 py-3 border-muted bg-muted/20 "
				>
					<div className="flex flex-col items-start gap-2 px-2.5">
						<Skeleton className="size-10 rounded-lg" />
						<div className="flex-1 space-y-2 w-full">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-8 w-full" />
						</div>
					</div>
					<div className="flex items-center justify-end">
						<Skeleton className="h-4 w-32" />
					</div>
				</div>
			))}
		</div>
	);
}
