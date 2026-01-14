"use client";

import { useState } from "react";
import { Users, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

type SpaceFilter = "recommended" | "recent";

export default function ForYouPage() {
	const [spaceFilter, setSpaceFilter] = useState<SpaceFilter>("recommended");

	return (
		<div className="flex-1 overflow-auto bg-background">
			<div className="mx-auto p-4 md:p-8">
				<h1 className="text-2xl font-semibold text-foreground">For you</h1>
				<hr className="my-4" />

				<div className="mb-8">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-medium text-foreground">
							{spaceFilter === "recommended"
								? "Recommended spaces"
								: "Recent spaces"}
						</h2>
						<div className="flex items-center gap-2">
							<button
								onClick={() => setSpaceFilter("recommended")}
								className={cn(
									"px-3 py-1.5 text-sm rounded-md transition-colors border cursor-pointer",
									spaceFilter === "recommended"
										? "border-primary text-primary hover:bg-primary/10"
										: "border-transparent hover:bg-muted",
								)}
							>
								Recommended
							</button>
							<button
								onClick={() => setSpaceFilter("recent")}
								className={cn(
									"px-3 py-1.5 text-sm rounded-md transition-colors border cursor-pointer",
									spaceFilter === "recent"
										? "border-primary text-primary hover:bg-primary/10"
										: "border-transparent hover:bg-muted",
								)}
							>
								Recent
							</button>
							<Link
								href="/spaces"
								className="text-sm text-primary hover:underline ml-2 hidden md:inline-block"
							>
								View all spaces
							</Link>
						</div>
					</div>
					<div className="flex gap-4 overflow-auto py-1">
						{spaceFilter === "recommended" ? (
							<>
								<div className="shrink-0 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors bg-card flex flex-col justify-between cursor-pointer">
									<div className="space-y-0.5">
										<h3 className="font-medium text-foreground truncate">
											Project Management
										</h3>
										<p className="text-sm text-muted-foreground">
											Software project
										</p>
									</div>
									<div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-4">
										<Users className="h-3.5 w-3.5" />
										<span>Popular with teammates</span>
									</div>
								</div>
							</>
						) : (
							<>
								<div className="shrink-0 w-64 rounded-sm flex flex-col justify-between border-l-20 border-l-primary py-1 space-y-1 shadow-md">
									<div className="flex items-start gap-3 px-4">
										<div className="min-w-0">
											<h3 className="font-medium truncate">
												Billing System Dev
											</h3>
											<p className="text-sm text-muted-foreground">
												Team-managed software
											</p>
										</div>
									</div>

									<div className="px-4">
										<p className="text-xs font-medium text-muted-foreground">
											Quick links
										</p>
										<div className="flex items-center justify-between text-xs  transition-colors">
											<span>My open work items</span>
											<Badge variant="secondary" className="bg-primary/20">
												8
											</Badge>
										</div>
										<div className="flex items-center text-xs transition-colors">
											<span>Done work items</span>
										</div>
									</div>

									<div className="border-t border-border px-4 flex items-center justify-between pt-0.5">
										<button className="flex items-center py-0.5 px-2 gap-1 text-xs transition-colors hover:bg-muted/90 cursor-pointer">
											<span>1 board</span>
											<ChevronDown className="h-3 w-3" />
										</button>
									</div>
								</div>
							</>
						)}
					</div>
					<div className="flex w-full items-center justify-end">
						<div className="text-sm text-primary hover:underline mt-2 inline-block md:hidden">
							View all spaces
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
