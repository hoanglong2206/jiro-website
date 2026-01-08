import { Sidebar } from "@/components/app";

interface AppLayoutProps {
	children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
	return (
		<div className="flex h-full">
			<Sidebar />
			<div className="flex flex-1 flex-col overflow-auto">{children}</div>
		</div>
	);
}
