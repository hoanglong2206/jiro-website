"use client";
import type React from "react";
import { Header } from "@/components/app";
import { useProtectRoute } from "@/hooks/useProtectRoute";

interface AppLayoutProps {
	children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
	// Redirect to /login when unauthenticated
	useProtectRoute();

	return (
		<div className="h-screen flex flex-col">
			<Header />
			<main className="flex-1 overflow-auto no-scrollbar">
				{children}
			</main>
		</div>
	);
}
