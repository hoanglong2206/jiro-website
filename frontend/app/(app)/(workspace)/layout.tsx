"use client";

import { Sidebar } from "@/components/app";

interface AppLayoutProps {
	children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
	return (
		<div className="flex max-h-[888px]">
			<Sidebar />
			<div className="flex flex-1 flex-col overflow-auto">{children}</div>
		</div>
	);
}
