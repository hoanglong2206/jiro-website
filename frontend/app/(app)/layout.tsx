"use client";
import type React from "react";
import { Header } from "@/components/app";
import { SidebarProvider } from "@/components/providers/SidebarProvider";
import { useProtectRoute } from "@/services/protectRoute";

interface AppLayoutProps {
	children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
	// Redirect to /login when unauthenticated
	useProtectRoute("/login");

	return (
		<SidebarProvider>
			<div className="h-screen flex flex-col">
				<Header />
				<main className="flex-1 overflow-auto no-scrollbar">{children}</main>
			</div>
		</SidebarProvider>
	);
}
