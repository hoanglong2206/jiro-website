"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useGetProjectsQuery } from "@/services/project.service";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
	setProjects,
	setCurrentProject,
} from "@/store/reducers/project.reducer";
import { CreateProjectModal } from "@/components/app/CreateProjectModal";
import { Badge } from "@/components/ui/badge";
import { IProjectResponse } from "@/types/project.interface";
import { saveToLocalStorage } from "@/services/utils.service";
import { Skeleton } from "@/components/ui/skeleton";

export default function ForYouPage() {
	const dispatch = useAppDispatch();
	const { projects } = useAppSelector((state) => state.project);
	const { data, isFetching } = useGetProjectsQuery(undefined, {
		refetchOnMountOrArgChange: true,
	});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const notifications: unknown[] = [];

	const projectList = data?.projects ?? projects;

	useEffect(() => {
		if (data?.projects) {
			dispatch(setProjects(data.projects));
		}
	}, [data?.projects, dispatch]);

	return (
		<>
			<div className="overflow-auto bg-background">
				<div className="mx-auto p-4 md:px-16">
					<h1 className="text-2xl font-semibold text-foreground">For you</h1>
					<hr className="my-4" />

					<div className="flex flex-col gap-2">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-lg font-medium text-foreground">Projects</h2>
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
									<ProjectCard key={project.id} project={project} />
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

	return (
		<Link
			onClick={() => {
				dispatch(setCurrentProject(project));
				saveToLocalStorage("currentProject", JSON.stringify(project));
			}}
			href={`/projects/${project.id}/home`}
			className="flex w-64 shrink-0 flex-col justify-between rounded-sm space-y-1 border-l-24 border-l-primary py-1 transition-shadow hover:shadow-md"
		>
			<div className="flex items-start gap-2 px-2.5">
				<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-400">
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
								?.split(" ")
								.map((x) => x[0])
								.join("")}
						</span>
					)}
				</div>
				<div className="min-w-0">
					<h3 className="truncate font-medium">{project.name}</h3>
					<p className="text-xs italic capitalize text-muted-foreground">
						{project.type}
					</p>
				</div>
			</div>

			<div className="px-2.5">
				<p className="text-xs font-medium text-muted-foreground">Quick links</p>
				<div className="flex items-center justify-between text-xs transition-colors">
					<span>My open work items</span>
					<Badge
						variant="secondary"
						className="size-5 rounded-full bg-primary/20"
					>
						8
					</Badge>
				</div>
				<div className="flex items-center text-xs transition-colors">
					<span>Done work items</span>
				</div>
			</div>

			<div className="flex items-center justify-between border-t border-border px-2.5 pt-0.5">
				<button className="flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-0.5 text-xs transition-colors hover:bg-muted/90">
					<span>1 workspace</span>
					<ChevronDown className="h-3 w-3" />
				</button>
			</div>
		</Link>
	);
}

function ProjectsSkeleton() {
	return (
		<div className="flex gap-4 overflow-auto py-1">
			{Array.from({ length: 3 }).map((_, index) => (
				<div
					key={index}
					className="flex w-64 shrink-0 flex-col justify-between space-y-1 rounded-sm border-l-24 border-l-muted bg-muted/20 py-1"
				>
					<div className="flex items-start gap-2 px-2.5">
						<Skeleton className="size-8 rounded-lg" />
						<div className="flex-1 space-y-2">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-3 w-20" />
						</div>
					</div>
					<div className="space-y-2 px-2.5">
						<Skeleton className="h-3 w-24" />
						<Skeleton className="h-3 w-28" />
						<Skeleton className="h-3 w-20" />
					</div>
					<div className="flex items-center justify-between border-t border-border px-2.5 pt-0.5">
						<Skeleton className="h-5 w-24" />
						<Skeleton className="h-4 w-4 rounded-full" />
					</div>
				</div>
			))}
		</div>
	);
}
