import type React from "react";
import { projects } from "@/lib/data";
import { ProjectHeader } from "@/components/app";

export default async function ProjectLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const project = projects.find((p) => p.id === id) || projects[0];

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<ProjectHeader project={project} />
			<div className="flex-1 overflow-auto bg-background">{children}</div>
		</div>
	);
}
