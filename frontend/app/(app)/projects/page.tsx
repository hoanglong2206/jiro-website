"use client";

import { CSSProperties, ElementType, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProjectsTable } from "@/components/app/ProjectsTable";
import { CreateProjectModal } from "@/components/app/CreateProjectModal";
import { useGetProjectsQuery } from "@/services/project.service";
import { setProjects } from "@/store/reducers/project.reducer";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { IProjectResponse } from "@/types/project.interface";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Lock, LockOpen, Upload, UsersRound, Warehouse } from "lucide-react";
import { CustomModal } from "@/components/ui/modal";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";

const colorList: { label: string; value: string }[] = [
	{ label: "Red", value: "#f87171" },
	{ label: "Orange", value: "#fdba74" },
	{ label: "Yellow", value: "#fce94f" },
	{ label: "Blue", value: "#7dd3fc" },
	{ label: "Gray", value: "#9ca3af" },
	{ label: "Purple", value: "#c084fc" },
	{ label: "Fuchsia", value: "#e879f9" },
	{ label: "Pink", value: "#fca5a5" },
	{ label: "Green", value: "#94e2cd" },
	{ label: "Teal", value: "#2dd4bf" },
];

const ProjectsPage = () => {
	const dispatch = useAppDispatch();
	const { projects } = useAppSelector((state) => state.project);
	const { data, isFetching, isError, refetch } = useGetProjectsQuery();
	const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	useEffect(() => {
		if (data?.projects) {
			dispatch(setProjects(data.projects));
		}
	}, [data, dispatch]);

	const [currentProject, setCurrentProject] = useState<IProjectResponse>();

	useEffect(() => {
		if (projects.length) {
			setCurrentProject(projects[0]);
		}
	}, [projects]);

	if (isFetching && !projects.length) {
		return (
			<div className="p-6 text-sm text-muted-foreground">
				Loading projects...
			</div>
		);
	}

	if (isError) {
		return (
			<div className="p-6 space-y-3 flex flex-col items-center justify-center">
				<div className="text-sm text-red-500">
					Unable to load projects.
				</div>
				<Button size="sm" variant="outline" onClick={() => refetch()}>
					Retry
				</Button>
			</div>
		);
	}

	return (
		<>
			<div className="p-6 space-y-6">
				<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
					<div className="space-y-1">
						<h1 className="text-xl font-semibold">Projects</h1>
						<p className="text-sm text-muted-foreground">
							Manage the projects you own or collaborate on.
						</p>
					</div>
					<div className="flex items-center gap-2">
						<Button
							className="cursor-pointer"
							onClick={() => setIsCreateModalOpen(true)}
						>
							New project
						</Button>
					</div>
				</div>
				{projects.length === 0 ? (
					<div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
						No projects yet. Create one to get started.
					</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
						<div className="col-span-2">
							<ProjectsTable
								data={projects}
								onSelectProject={setCurrentProject}
							/>
						</div>
						<div className="col-span-1 mt-2">
							<Card>
								<CardHeader>
									<h1 className="text-xl font-semibold">
										My Settings
									</h1>
								</CardHeader>
								<CardContent>
									<form>
										<div className="flex border rounded-t-md py-2 px-4 justify-between items-center gap-4">
											<Label className="font-medium">
												Avatar
											</Label>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<div
														style={{
															backgroundColor:
																currentProject?.color ||
																"",
														}}
														className="flex aspect-square size-10 items-center justify-center rounded-lg"
													>
														{currentProject?.icon ? (
															<Image
																src={
																	currentProject?.icon
																}
																alt={
																	currentProject?.name
																}
																width={15}
																height={15}
															/>
														) : (
															<span className="font-medium text-background">
																{currentProject?.name
																	.split(" ")
																	.map(
																		(x) =>
																			x[0],
																	)
																	.join("")}
															</span>
														)}
													</div>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													className="min-w-32 rounded-lg px-2"
													align="start"
													side="bottom"
													sideOffset={4}
												>
													<DropdownMenuLabel className="text-muted-foreground text-xs">
														Color
													</DropdownMenuLabel>
													<RadioGroup className="grid grid-cols-5 gap-1.5">
														{colorList.map(
															(swatch) => (
																<Tooltip
																	key={
																		swatch.label
																	}
																>
																	<TooltipTrigger
																		asChild
																	>
																		<div>
																			<RadioGroupItem
																				value={
																					swatch.value
																				}
																				id={
																					swatch.label
																				}
																				className="peer sr-only "
																			/>
																			<Label
																				htmlFor={
																					swatch.label
																				}
																				className=" flex w-6 h-6 items-center justify-center rounded-full border-2 border-muted bg-popover p-2 cursor-pointer  hover:ring-2 hover:ring-sidebar-ring peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-(--checked-color) peer-data-[state=checked]:hover:ring-(--checked-color)"
																				style={
																					{
																						backgroundColor:
																							swatch.value,
																						"--checked-color":
																							swatch.value,
																					} as CSSProperties
																				}
																			></Label>
																		</div>
																	</TooltipTrigger>
																	<TooltipContent side="bottom">
																		<p>
																			{
																				swatch.label
																			}
																		</p>
																	</TooltipContent>
																</Tooltip>
															),
														)}
													</RadioGroup>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														onClick={() =>
															setIsModalOpen(true)
														}
														className="gap-2 p-2 cursor-pointer"
													>
														<Upload className="size-4" />
														<div className="text-muted-foreground font-medium">
															Upload avatar
														</div>
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
										<div className="flex border border-t-0 py-2 px-4 justify-between items-center gap-4">
											<Label className="font-medium">
												Name
											</Label>
											<Input
												value={currentProject?.name}
												className="max-w-80"
											/>
										</div>
										<div className="flex border border-t-0 py-2 px-4 justify-between items-center gap-4">
											<Label className="font-medium">
												Description
											</Label>
											<Textarea
												value={
													currentProject?.description
												}
												className="max-w-80"
											/>
										</div>
										<div className="flex border border-t-0 py-2 px-4 justify-between items-center gap-4">
											<Label className="font-medium">
												Type
											</Label>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														className="px-4 py-1.5 cursor-pointer min-w-48 capitalize flex items-center justify-start gap-2 focus-visible:ring-0"
														variant="secondary"
													>
														{currentProject?.type ===
														"personal" ? (
															<UsersRound className="h-4 w-4" />
														) : (
															<Warehouse className="h-4 w-4" />
														)}
														{currentProject?.type}
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													className="z-9999 min-w-48 space-y-1"
													align="start"
												>
													{[
														{
															label: "Personal",
															value: "personal",
															icon: UsersRound,
														},
														{
															label: "Work",
															value: "work",
															icon: Warehouse,
														},
													].map((option) => {
														const OptionIcon =
															option.icon;
														return (
															<DropdownMenuItem
																key={
																	option.value
																}
																className="cursor-pointer flex items-center gap-2 hover:bg-muted/90 transition-colors"
															>
																<OptionIcon className="h-4 w-4" />
																{option.label}
															</DropdownMenuItem>
														);
													})}
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
										<div className="flex border border-t-0 py-2 px-4 justify-between items-center gap-4">
											<Label className="font-medium">
												Access Level
											</Label>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														className="px-4 py-1.5 cursor-pointer min-w-48 capitalize flex items-center justify-start gap-2 focus-visible:ring-0"
														variant="secondary"
													>
														{currentProject?.accessLevel ===
														"private" ? (
															<Lock className="h-4 w-4" />
														) : (
															<LockOpen className="h-4 w-4" />
														)}
														{
															currentProject?.accessLevel
														}
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													className="z-9999 min-w-48 space-y-1"
													align="start"
												>
													{[
														{
															label: "Private",
															value: "private",
															icon: Lock,
														},
														{
															label: "Public",
															value: "public",
															icon: LockOpen,
														},
													].map((option) => {
														const OptionIcon =
															option.icon;
														return (
															<DropdownMenuItem
																key={
																	option.value
																}
																className="cursor-pointer flex items-center gap-2 hover:bg-muted/90 transition-colors"
															>
																<OptionIcon className="h-4 w-4" />
																{option.label}
															</DropdownMenuItem>
														);
													})}
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
										<div className="flex border rounded-b-md border-t-0 py-2 px-4 justify-between items-center gap-4">
											<Label className="font-medium">
												Owner
											</Label>
											<div className="flex items-center gap-2">
												<Avatar className="h-8 w-8 cursor-pointer">
													<AvatarImage
														src={""}
														alt={"example"}
													/>
													<AvatarFallback
														className="text-white text-lg tracking-wider"
														style={{
															backgroundColor: "",
														}}
													>
														{"example"
															.split(" ")
															.map((x) => x[0])
															.join("")}
													</AvatarFallback>
												</Avatar>
												<div className="">
													<p className="font-semibold">
														example
													</p>
													<p className="text-xs text-muted-foreground">
														example@example.com
													</p>
												</div>
											</div>
										</div>
										<div className="flex items-center justify-end mt-4">
											<Button
												type="submit"
												className="cursor-pointer"
											>
												Save Changes
											</Button>
										</div>
									</form>
								</CardContent>
							</Card>
						</div>
					</div>
				)}
			</div>
			<CreateProjectModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
			/>
			<CustomModal
				open={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				size="w-64"
			>
				<div className="flex h-full flex-col gap-6 px-4 pb-4">
					<div className="space-y-6">
						<div className="relative border rounded-md overflow-hidden w-44 h-44 mt-10 self-center">
							<div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
								No image selected
							</div>
						</div>
						<div className="space-y-2">
							<Label
								className="block text-sm font-medium"
								htmlFor="profilePicture"
							>
								Upload profile picture
							</Label>
							<Input
								id="profilePicture"
								type="file"
								accept="image/*"
								className="cursor-pointer"
							/>
							<Button
								type="button"
								variant="outline"
								className="w-full cursor-pointer"
							>
								Remove avatar
							</Button>
						</div>
					</div>
				</div>
			</CustomModal>
		</>
	);
};

export default ProjectsPage;
