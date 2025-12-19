"use client";
import type React from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return <main className="flex-1 overflow-auto p-6">{children}</main>;
}
