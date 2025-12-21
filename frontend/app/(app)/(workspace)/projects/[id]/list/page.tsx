"use client";

import { Filter, Search, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ListPage() {
	return (
		<div className="flex h-full flex-col">
			<div className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
				<div className="flex items-center gap-3">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Search list"
							className="h-9 w-48 bg-muted pl-9 focus-visible:ring-primary"
						/>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						className="gap-2 text-muted-foreground cursor-pointer"
					>
						<Filter className="h-4 w-4" />
						Filter
					</Button>
					<Button
						variant="ghost"
						size={"icon"}
						className="gap-2 cursor-pointer"
					>
						<Upload className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
