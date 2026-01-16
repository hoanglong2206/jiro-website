import type React from "react";
import { projects } from "@/lib/data";
import { ProjectHeader } from "@/components/app";

export default async function ProjectLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const project = projects.find((p) => p.id === slug) || projects[0];

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<ProjectHeader project={project} />
			<div className="flex-1 bg-background">{children}</div>
		</div>
	);
}
