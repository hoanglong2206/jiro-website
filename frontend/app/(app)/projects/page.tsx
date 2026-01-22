"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProjectsTable } from "@/components/app/ProjectsTable";
import { CreateProjectModal } from "@/components/app/CreateProjectModal";
import {
	useGetProjectsQuery,
	useUpdateProjectMutation,
} from "@/services/project.service";
import { setProjects } from "@/store/reducers/project.reducer";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
	IProjectResponse,
	IUpdateProjectPayload,
	ProjectAccessLevel,
	ProjectType,
} from "@/types/project.interface";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Loader,
	Loader2,
	Lock,
	LockOpen,
	Upload,
	UsersRound,
	Warehouse,
} from "lucide-react";
import { CustomModal } from "@/components/ui/modal";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { extractErrorMessage } from "@/services/utils.service";
import { IUser } from "@/types/user.interface";
import { ColorPicker } from "@/components/app";

const ProjectsPage = () => {
	const dispatch = useAppDispatch();
	const { projects } = useAppSelector((state) => state.project);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [currentProject, setCurrentProject] = useState<IProjectResponse>();
	const [iconPictureValue, setIconPictureValue] = useState<string | null>(
		null,
	);
	const [iconPicturePreview, setIconPicturePreview] = useState<string | null>(
		null,
	);
	const [formValues, setFormValues] = useState<IUpdateProjectPayload>({
		name: "",
		description: "",
		type: "personal",
		accessLevel: "private",
		color: "",
		icon: "",
	});
	const userInfo: IUser = useAppSelector((state) => state.user);

	const { data, isFetching, isError, refetch } = useGetProjectsQuery();
	const [updateProjectMutation, { isLoading: isUpdating }] =
		useUpdateProjectMutation();

	useEffect(() => {
		if (data?.projects) {
			dispatch(setProjects(data.projects));
		}
	}, [data, dispatch]);

	useEffect(() => {
		if (!projects.length) {
			setCurrentProject(undefined);
			return;
		}

		const syncTarget = currentProject
			? projects.find((project) => project.id === currentProject.id)
			: projects[0];

		if (!syncTarget) {
			return;
		}

		if (syncTarget !== currentProject) {
			setCurrentProject(syncTarget);
		}

		setFormValues({
			name: syncTarget.name,
			description: syncTarget.description ?? "",
			type: syncTarget.type,
			accessLevel: syncTarget.accessLevel,
			color: syncTarget.color ?? "",
			icon: syncTarget.icon ?? "",
		});
	}, [projects, currentProject]);

	const handleSelectProject = (project: IProjectResponse) => {
		setCurrentProject(project);
		setFormValues({
			name: project.name,
			description: project.description ?? "",
			type: project.type,
			accessLevel: project.accessLevel,
			color: project.color ?? "",
			icon: project.icon ?? "",
		});
	};

	const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) {
			return;
		}

		const reader = new FileReader();
		reader.onloadend = () => {
			const result = reader.result as string;
			setIconPictureValue(result);
			setIconPicturePreview(result);
			setFormValues((prev) => ({
				...prev,
				icon: result,
			}));
		};
		reader.readAsDataURL(file);
		event.target.value = "";
	};

	const handleRemoveAvatar = () => {
		setIconPictureValue(null);
		setIconPicturePreview(null);
		setFormValues((prev) => ({
			...prev,
			icon: "",
		}));
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!currentProject) {
			return;
		}

		const trimmedName = formValues.name?.trim();
		if (!trimmedName) {
			toast.error("Project name is required.");
			return;
		}

		const trimmedDescription = formValues.description?.trim();
		const normalizedDescription = trimmedDescription || "";
		const payload: IUpdateProjectPayload = {};

		let hasChanges = false;
		if (trimmedName !== currentProject.name) {
			payload.name = trimmedName;
			hasChanges = true;
		}

		const currentDescription = currentProject.description ?? "";
		if (normalizedDescription !== currentDescription) {
			payload.description = normalizedDescription;
			hasChanges = true;
		}

		if (formValues.type !== currentProject.type) {
			payload.type = formValues.type;
			hasChanges = true;
		}

		if (formValues.accessLevel !== currentProject.accessLevel) {
			payload.accessLevel = formValues.accessLevel;
			hasChanges = true;
		}

		const normalizedColor = formValues.color || "";
		const currentColor = currentProject.color ?? "";
		if (normalizedColor !== currentColor) {
			payload.color = normalizedColor;
			hasChanges = true;
		}

		const normalizedIcon = formValues.icon || "";
		const currentIcon = currentProject.icon ?? "";
		if (normalizedIcon !== currentIcon) {
			payload.icon = normalizedIcon;
			hasChanges = true;
		}

		if (!hasChanges) {
			toast.info("No changes to save.");
			return;
		}

		try {
			const response = await updateProjectMutation({
				project: payload,
				projectId: currentProject.id,
				userId: userInfo.id,
			}).unwrap();
			toast.success(response.message || "Project updated successfully");
		} catch (error) {
			const message = extractErrorMessage(
				error,
				"Failed to update project",
			);
			toast.error(message);
		}
	};

	if (isFetching && !projects.length) {
		return (
			<div className="flex items-center justify-center h-full">
				<Loader className="animate-spin" />
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
								onSelectProject={handleSelectProject}
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
									<form onSubmit={handleSubmit}>
										<div className="flex border rounded-t-md py-2 px-4 justify-between items-center gap-4">
											<Label className="font-medium">
												Avatar
											</Label>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<div className="cursor-pointer">
														{formValues.icon ? (
															<Image
																src={
																	formValues.icon
																}
																alt={
																	formValues.name ||
																	""
																}
																width={40}
																height={40}
																className="rounded-md"
															/>
														) : (
															<span
																className="font-medium text-background size-10 flex aspect-square items-center justify-center rounded-lg "
																style={{
																	backgroundColor:
																		formValues.color ||
																		"",
																}}
															>
																{(
																	formValues.name ||
																	""
																)
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
													<ColorPicker
														value={formValues.color}
														onChange={(value) =>
															setFormValues(
																(prev) => ({
																	...prev,
																	color: value,
																}),
															)
														}
													/>
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
												value={formValues.name}
												onChange={(event) =>
													setFormValues((prev) => ({
														...prev,
														name: event.target
															.value,
													}))
												}
												className="max-w-80"
											/>
										</div>
										<div className="flex border border-t-0 py-2 px-4 justify-between items-center gap-4">
											<Label className="font-medium">
												Description
											</Label>
											<Textarea
												value={formValues.description}
												onChange={(event) =>
													setFormValues((prev) => ({
														...prev,
														description:
															event.target.value,
													}))
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
														{formValues.type ===
														"personal" ? (
															<UsersRound className="h-4 w-4" />
														) : (
															<Warehouse className="h-4 w-4" />
														)}
														{formValues.type}
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
																onClick={() =>
																	setFormValues(
																		(
																			prev,
																		) => ({
																			...prev,
																			type: option.value as ProjectType,
																		}),
																	)
																}
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
														{formValues.accessLevel ===
														"private" ? (
															<Lock className="h-4 w-4" />
														) : (
															<LockOpen className="h-4 w-4" />
														)}
														{formValues.accessLevel}
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
																onClick={() =>
																	setFormValues(
																		(
																			prev,
																		) => ({
																			...prev,
																			accessLevel:
																				option.value as ProjectAccessLevel,
																		}),
																	)
																}
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
												<Avatar className="h-8 w-8">
													<AvatarImage
														src={
															currentProject?.ownerProfilePicture ||
															undefined
														}
														alt={
															currentProject?.ownerFullname
														}
													/>
													<AvatarFallback
														className="text-white tracking-wider"
														style={{
															backgroundColor:
																currentProject?.ownerColorAvatar ||
																"",
														}}
													>
														{currentProject?.ownerFullname
															.split(" ")
															.map((x) => x[0])
															.join("")}
													</AvatarFallback>
												</Avatar>
												<div className="">
													<p className="font-semibold">
														{
															currentProject?.ownerFullname
														}
													</p>
													<p className="text-xs text-muted-foreground">
														{
															currentProject?.ownerEmail
														}
													</p>
												</div>
											</div>
										</div>
										<div className="flex items-center justify-end mt-4">
											<Button
												className="gap-2 cursor-pointer"
												disabled={
													isUpdating ||
													!currentProject
												}
												type="submit"
											>
												{isUpdating && (
													<Loader2 className="size-4 animate-spin" />
												)}
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
							{iconPicturePreview ? (
								<Image
									src={iconPicturePreview}
									alt="Profile preview"
									fill
									className="object-cover"
								/>
							) : (
								<div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
									No image selected
								</div>
							)}
						</div>
						<div className="space-y-2">
							<Label
								className="block text-sm font-medium"
								htmlFor="icon"
							>
								Upload icon picture
							</Label>
							<Input
								id="icon"
								type="file"
								accept="image/*"
								className="cursor-pointer"
								onChange={handleAvatarChange}
							/>
							<Button
								type="button"
								variant="outline"
								className="w-full cursor-pointer"
								onClick={handleRemoveAvatar}
								disabled={!iconPictureValue}
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
