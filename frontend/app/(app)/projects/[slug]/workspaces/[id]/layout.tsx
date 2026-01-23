import type React from "react";
import { WorkspaceHeader } from "@/components/app";

export default function ProjectLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<WorkspaceHeader />
			<div className="flex-1 bg-background">{children}</div>
		</div>
	);
}
