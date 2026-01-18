"use client";

import { AppSidebar } from "@/components/app";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { usePathname, useParams } from "next/navigation";
import {
	Home,
	Inbox,
	MessageSquareText,
	UsersRound,
	Component,
	Radio,
} from "lucide-react";
import { ElementType, useEffect } from "react";
import { useGetProjectByIdQuery } from "@/services/project.service";
import { useAppDispatch } from "@/store/store";
import {
	clearCurrentProject,
	setCurrentProject,
} from "@/store/reducers/project.reducer";

interface AppLayoutProps {
	children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
	const pathname = usePathname();
	const params = useParams<{ slug: string }>();
	const dispatch = useAppDispatch();
	const projectId = Array.isArray(params?.slug)
		? params?.slug[0]
		: params?.slug;
	const {
		data: projectData,
		isFetching,
		isError,
	} = useGetProjectByIdQuery(projectId ?? "", {
		skip: !projectId,
	});

	useEffect(() => {
		if (projectData?.project) {
			dispatch(setCurrentProject(projectData.project));
		}
	}, [dispatch, projectData]);

	useEffect(() => {
		if (isError) {
			dispatch(clearCurrentProject());
		}
	}, [dispatch, isError]);

	if (!projectId) {
		return (
			<div className="flex h-screen items-center justify-center text-sm text-muted-foreground">
				Invalid project reference.
			</div>
		);
	}

	const lastSegment = pathname.split("/").filter(Boolean).pop() || "home";

	// Mapping từ lastSegment sang icon
	const getHeaderIcon = (segment: string): ElementType => {
		switch (segment.toLowerCase()) {
			case "home":
				return Home;
			case "inbox":
				return Inbox;
			case "chat":
				return MessageSquareText;
			case "people":
				return UsersRound;
			case "teams":
				return Component;
			case "analytics":
				return Radio;
			default:
				return Home; // Default icon nếu không khớp
		}
	};

	const Icon = getHeaderIcon(lastSegment);
	const title = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-10">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
						<div className="flex items-center gap-1">
							<Icon className="h-4 w-4" />
							{title}
						</div>
					</div>
				</header>
				<div className="flex flex-1 flex-col overflow-auto">
					{isFetching && !projectData?.project ? (
						<div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
							Loading project...
						</div>
					) : (
						children
					)}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
