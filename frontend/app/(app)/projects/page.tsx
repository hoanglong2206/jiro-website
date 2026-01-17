"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProjectsTable } from "@/components/app/ProjectsTable";
import { CreateProjectModal } from "@/components/app/CreateProjectModal";
import { useGetProjectsQuery } from "@/services/project.service";
import {
	setProjects,
	setCurrentProject,
} from "@/store/reducers/project.reducer";
import { useAppDispatch, useAppSelector } from "@/store/store";

const ProjectsPage = () => {
	const dispatch = useAppDispatch();
	const { projects } = useAppSelector((state) => state.project);
	const { data, isFetching, isError, refetch } = useGetProjectsQuery();
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		if (data?.projects) {
			dispatch(setProjects(data.projects));
		}
	}, [data, dispatch]);

	if (isFetching && !projects.length) {
		return (
			<div className="p-6 text-sm text-muted-foreground">
				Loading projects...
			</div>
		);
	}

	if (isError) {
		return (
			<div className="p-6 space-y-3">
				<div className="text-sm text-red-500">
					Unable to load projects.
				</div>
				<Button size="sm" variant="outline" onClick={() => refetch()}>
					Retry
				</Button>
			</div>
		);
	}

	return (
		<>
			<div className="p-6 space-y-6">
				<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
					<div className="space-y-1">
						<h1 className="text-xl font-semibold">Projects</h1>
						<p className="text-sm text-muted-foreground">
							Manage the projects you own or collaborate on.
						</p>
					</div>
					<div className="flex items-center gap-2">
						<Button size="sm" onClick={() => setIsModalOpen(true)}>
							New project
						</Button>
					</div>
				</div>
				{projects.length === 0 ? (
					<div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
						No projects yet. Create one to get started.
					</div>
				) : (
					<ProjectsTable data={projects} />
				)}
			</div>
			<CreateProjectModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</>
	);
};

export default ProjectsPage;
