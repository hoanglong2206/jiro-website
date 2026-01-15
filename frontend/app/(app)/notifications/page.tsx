"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Bell, BellDot, Search } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export default function Notifications() {
	const [typeNotification, setTypeNotification] = useState<"all" | "unread">(
		"all"
	);
	const [filter, setFilter] = useState<string[]>([
		"friend",
		"comment",
		"system",
		"mention",
	]);
	const [search, setSearch] = useState<string>("");
	return (
		<div className="h-full flex flex-col">
			<div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
				<aside className="w-64 bg-accent/50 text-sidebar-foreground border-r border-sidebar-foreground/2 hidden lg:block">
					<header className="px-4 py-4 flex items-center justify-between">
						<h1 className="text-xl font-semibold">Notifications</h1>
					</header>
					<nav className="mt-2 px-3 space-y-1.5">
						<div
							onClick={() => setTypeNotification("all")}
							className={cn(
								"flex items-center px-4 py-2 rounded-md text-sm hover:bg-sidebar-accent cursor-pointer transition-colors",
								typeNotification === "all" &&
									"bg-sidebar-primary/20 hover:bg-sidebar-primary/40 text-primary/90 hover:text-primary font-medium"
							)}
						>
							<Bell className="w-4 h-4 mr-3" />
							All
						</div>

						<div
							onClick={() => setTypeNotification("unread")}
							className={cn(
								"flex items-center px-4 py-2 rounded-md text-sm hover:bg-sidebar-accent cursor-pointer transition-colors",
								typeNotification === "unread" &&
									"bg-sidebar-primary/20 hover:bg-sidebar-primary/40 text-primary/90 hover:text-primary font-medium"
							)}
						>
							<BellDot className="w-4 h-4 mr-3" />
							Unread
						</div>
					</nav>
				</aside>
				<div className="flex lg:hidden items-center gap-1 border-b border-border">
					<div
						onClick={() => setTypeNotification("all")}
						className={cn(
							"flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium transition-color cursor-pointer",
							typeNotification === "all"
								? "border-primary text-primary"
								: "border-transparent text-muted-foreground hover:border-muted-foreground hover:text-foreground"
						)}
					>
						<Bell className="w-4 h-4 mr-3" />
						All
					</div>
					<div
						onClick={() => setTypeNotification("unread")}
						className={cn(
							"flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium transition-color cursor-pointer",
							typeNotification === "unread"
								? "border-primary text-primary"
								: "border-transparent text-muted-foreground hover:border-muted-foreground hover:text-foreground"
						)}
					>
						<BellDot className="w-4 h-4 mr-3" />
						Unread
					</div>
				</div>
				{/* Main Area */}
				<main className="flex-1 flex flex-col px-8 py-4 overflow-y-auto">
					<div className="flex items-center justify-between w-full gap-x-4">
						<div className="relative w-full max-w-xl">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search"
								className="h-9 pl-9 focus-visible:ring-primary"
							/>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline">Filter</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuCheckboxItem
									key="all"
									checked={filter.length === 4}
									onCheckedChange={(checked) => {
										if (checked) {
											setFilter([
												"friend",
												"comment",
												"system",
												"mention",
											]);
										} else {
											setFilter([]);
										}
									}}
								>
									All
								</DropdownMenuCheckboxItem>
								{["Friend", "Comment", "System", "Mention"].map(
									(item) => {
										return (
											<DropdownMenuCheckboxItem
												key={item}
												checked={filter.includes(
													item.toLowerCase()
												)}
												onCheckedChange={(checked) => {
													const value =
														item.toLowerCase();
													setFilter((prev) =>
														checked
															? [...prev, value]
															: prev.filter(
																	(f) =>
																		f !==
																		value
															  )
													);
												}}
											>
												{item}
											</DropdownMenuCheckboxItem>
										);
									}
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<div className="w-full mt-6 space-y-3 flex-1 overflow-y-auto"></div>
				</main>
			</div>
		</div>
	);
}
