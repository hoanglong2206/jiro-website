"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { IProjectWithMembershipResponse } from "@/types/project.interface";
import Image from "next/image";
import { useGetProjectsQuery } from "@/services/project.service";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
	setProjects,
	setSelectedProject,
} from "@/store/reducers/project.reducer";
import { CreateProjectModal } from "@/components/app/CreateProjectModal";

export default function ForYouPage() {
	const dispatch = useAppDispatch();
	const { items: projects, selectedProjectId } = useAppSelector(
		(state) => state.project,
	);
	const { data, isFetching, isError, error } = useGetProjectsQuery();

	useEffect(() => {
		if (data?.projects) {
			dispatch(setProjects(data.projects));
		}
	}, [data?.projects, dispatch]);

	useEffect(() => {
		if (!selectedProjectId && projects.length > 0) {
			dispatch(setSelectedProject(projects[0].project.id));
		}
	}, [dispatch, projects, selectedProjectId]);

	const notifications: unknown[] = [];
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	return (
		<>
			<div className="overflow-auto bg-background">
				<div className="mx-auto p-4 md:px-16">
					<h1 className="text-2xl font-semibold text-foreground">For you</h1>
					<hr className="my-4" />

					<div className="flex flex-col gap-2">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-lg font-medium text-foreground">Projects</h2>
							<div className="flex items-center gap-2">
								<Link
									href="/projects"
									className="text-sm text-primary hover:underline ml-2 hidden md:inline-block"
								>
									View all projects
								</Link>
							</div>
						</div>
						{isFetching ? (
							<div className="flex flex-col items-center justify-center gap-3 py-6 text-sm text-muted-foreground">
								Loading projects...
							</div>
						) : isError ? (
							<div className="flex flex-col items-center justify-center gap-3 py-6 text-sm text-destructive">
								Failed to load projects
								{isError && "status" in error && error.status === 401 && (
									<span className="text-xs text-muted-foreground">
										Please sign in to view your projects.
									</span>
								)}
							</div>
						) : projects.length === 0 ? (
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
									<ProjectCard key={project.project.id} project={project} />
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

const ProjectCard = ({
	project,
}: {
	project: IProjectWithMembershipResponse;
}) => {
	const projectInfo = project.project;
	return (
		<Link
			href={`/projects/${projectInfo.id}/home`}
			className="shrink-0 w-64 rounded-sm flex flex-col justify-between border-l-24 border-l-primary py-1 space-y-1 hover:shadow-md transition-shadow"
		>
			<div className="flex items-start gap-2 px-2.5">
				<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-400">
					{projectInfo.icon ? (
						<Image
							src={projectInfo.icon}
							alt={projectInfo.name}
							width={15}
							height={15}
						/>
					) : (
						<span className="text-xs font-semibold text-white">
							{projectInfo.name?.charAt(0).toUpperCase() || "P"}
						</span>
					)}
				</div>
				<div className="min-w-0">
					<h3 className="font-medium truncate">{projectInfo.name}</h3>
					<p className="text-xs text-muted-foreground italic capitalize">
						{projectInfo.type}
					</p>
				</div>
			</div>

			<div className="px-2.5">
				<p className="text-xs font-medium text-muted-foreground">Quick links</p>
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
