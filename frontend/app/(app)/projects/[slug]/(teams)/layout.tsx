import { TeamHeader } from "@/components/app";
import type React from "react";

export default async function ProjectLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<TeamHeader />
			<div className="flex-1 overflow-auto bg-background">{children}</div>
		</div>
	);
}
