"use client";

import { createContext, useCallback, useContext, useState } from "react";

type SidebarContextValue = {
	isSidebarOpen: boolean;
	openSidebar: () => void;
	closeSidebar: () => void;
	toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextValue | undefined>(
	undefined,
);

interface SidebarProviderProps {
	children: React.ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const openSidebar = useCallback(() => {
		setIsSidebarOpen(true);
	}, []);

	const closeSidebar = useCallback(() => {
		setIsSidebarOpen(false);
	}, []);

	const toggleSidebar = useCallback(() => {
		setIsSidebarOpen((prev) => !prev);
	}, []);

	return (
		<SidebarContext.Provider
			value={{ isSidebarOpen, openSidebar, closeSidebar, toggleSidebar }}
		>
			{children}
		</SidebarContext.Provider>
	);
}

export function useSidebar() {
	const context = useContext(SidebarContext);

	if (!context) {
		throw new Error("useSidebar must be used within SidebarProvider");
	}

	return context;
}
