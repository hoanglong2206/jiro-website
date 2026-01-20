"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Lock, LockOpen } from "lucide-react";
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
import { motion } from "framer-motion";

export default function ForYouPage() {
	const dispatch = useAppDispatch();
	const { projects } = useAppSelector((state) => state.project);
	const { data, isFetching } = useGetProjectsQuery(undefined, {
		refetchOnMountOrArgChange: true,
	});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const notifications: unknown[] = [];

	console.log(data?.projects);
	const projectList = data?.projects ? [...data.projects] : projects;

	useEffect(() => {
		if (data?.projects) {
			dispatch(setProjects(data.projects));
		}
	}, [data?.projects, dispatch]);

	return (
		<>
			<div className="bg-background">
				<div className="mx-auto p-4 md:px-16">
					<motion.h1
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.3 }}
						className="text-2xl font-semibold text-foreground"
					>
						For you
					</motion.h1>
					<motion.hr
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						className="my-4"
					/>

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
							<motion.div
								initial="hidden"
								animate="visible"
								variants={{
									hidden: { opacity: 0 },
									visible: {
										opacity: 1,
									},
								}}
								transition={{ duration: 0.1 }}
								className="flex flex-col items-center justify-center gap-3"
							>
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
							</motion.div>
						) : (
							<motion.div
								initial="hidden"
								animate="visible"
								variants={{
									hidden: { opacity: 0 },
									visible: {
										opacity: 1,
									},
								}}
								transition={{ duration: 0.3 }}
								className="flex gap-4 overflow-auto py-1 no-scrollbar"
							>
								{projectList.map((project) => (
									<ProjectCard
										key={project.id}
										project={project}
									/>
								))}
							</motion.div>
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
		<div className="flex justify-between shrink-0 flex-col px-4 py-3 w-[384px] border border-muted rounded-md min-h-40">
			<div className="flex flex-col items-start gap-2">
				<div className="flex items-center w-full gap-2.5">
					<div
						style={{ backgroundColor: project.color || "" }}
						className="flex aspect-square size-12 items-center justify-center rounded-lg"
					>
						{project.icon ? (
							<Image
								src={project.icon}
								alt={project.name}
								width={15}
								height={15}
							/>
						) : (
							<span className="font-medium text-lg text-background">
								{project.name
									.split(" ")
									.map((x) => x[0])
									.join("")}
							</span>
						)}
					</div>

					<div>
						<p className="truncate font-medium text-lg">
							{project.name}
						</p>
						<span className="text-xs text-muted-foreground italic capitalize">
							{project.type}
						</span>
					</div>
				</div>
				<p className="text-sm italic capitalize text-muted-foreground py-1">
					{project.description || "No description"}
				</p>
			</div>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-1 text-muted-foreground">
					{project.accessLevel === "private" ? (
						<Lock className="size-4" />
					) : (
						<LockOpen className="size-4" />
					)}
					<p className="text-sm font-medium italic capitalize">
						{project.accessLevel}
					</p>
				</div>
				<Link
					href={`/projects/${project.id}/home`}
					className="text-sm text-primary font-medium hover:text-primary/90 transition-colors"
					onClick={() => {
						dispatch(setCurrentProject(project));
						saveToLocalStorage(
							"currentProject",
							JSON.stringify(project),
						);
					}}
				>
					Open Project →
				</Link>
			</div>
		</div>
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
