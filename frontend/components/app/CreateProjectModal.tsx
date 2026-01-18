"use client";

import { ElementType, FormEvent, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CustomModal } from "@/components/ui/modal";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProjectAccessLevel, ProjectType } from "@/types/project.interface";
import { Lock, LockOpen, Loader2, UsersRound, Warehouse } from "lucide-react";
import { useCreateProjectMutation } from "@/services/project.service";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { addProject } from "@/store/reducers/project.reducer";
import { IUser } from "@/types/user.interface";

interface CreateProjectModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const DEFAULT_TYPE: ProjectType = "personal";
const DEFAULT_ACCESS: ProjectAccessLevel = "private";

export function CreateProjectModal({
	isOpen,
	onClose,
}: CreateProjectModalProps) {
	const dispatch = useAppDispatch();
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [type, setType] = useState<ProjectType>(DEFAULT_TYPE);
	const [accessLevel, setAccessLevel] =
		useState<ProjectAccessLevel>(DEFAULT_ACCESS);
	const [createProject, { isLoading }] = useCreateProjectMutation();
	const userInfo: IUser = useAppSelector((state) => state.user);

	useEffect(() => {
		if (!isOpen) {
			setTimeout(() => {
				setName("");
				setDescription("");
				setType(DEFAULT_TYPE);
				setAccessLevel(DEFAULT_ACCESS);
			}, 200);
		}
	}, [isOpen]);

	const isSubmitDisabled = useMemo(() => {
		return !name.trim() || isLoading;
	}, [name, isLoading]);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (isSubmitDisabled) {
			return;
		}

		try {
			const result = await createProject({
				name: name.trim(),
				description: description.trim() || undefined,
				type,
				accessLevel,
				color: "#60a5fa",
				user: userInfo,
			}).unwrap();

			dispatch(addProject(result.project));
			toast.success("Project created successfully");
			onClose();
		} catch (error: any) {
			const message =
				error?.data?.message || error?.message || "Failed to create project";
			toast.error(message);
		}
	};

	return (
		<CustomModal open={isOpen} onClose={onClose} size="xl:min-w-lg">
			<div className="flex h-full flex-col gap-8 px-4">
				<h2 className="text-xl font-semibold">Add New Project</h2>
				<form className="space-y-6" onSubmit={handleSubmit}>
					<div className="space-y-1">
						<Label
							className="block text-sm font-medium mb-2"
							htmlFor="project-name"
						>
							Name<span className="text-red-500 ml-1">*</span>
						</Label>
						<Input
							className="h-9"
							id="project-name"
							value={name}
							onChange={(event) => setName(event.target.value)}
							placeholder="Project name"
							required
						/>
					</div>
					<div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
						<DropdownField
							id="project-type"
							label="Type"
							value={type}
							icon={type === "personal" ? UsersRound : Warehouse}
							options={[
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
							]}
							onChange={(value) => setType(value as ProjectType)}
						/>
						<DropdownField
							id="project-access"
							label="Access"
							value={accessLevel}
							icon={accessLevel === "private" ? Lock : LockOpen}
							options={[
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
							]}
							onChange={(value) => setAccessLevel(value as ProjectAccessLevel)}
						/>
					</div>
					<div className="space-y-1">
						<Label
							className="block text-sm font-medium mb-2"
							htmlFor="project-description"
						>
							Description
						</Label>
						<Textarea
							id="project-description"
							value={description}
							onChange={(event) => setDescription(event.target.value)}
							placeholder="Describe the project"
						/>
					</div>
					<div className="flex items-center justify-end">
						<Button
							className="gap-2 cursor-pointer flex w-full md:w-auto"
							type="submit"
							disabled={isSubmitDisabled}
						>
							{isLoading && <Loader2 className="size-4 animate-spin" />}
							Create
						</Button>
					</div>
				</form>
			</div>
		</CustomModal>
	);
}

interface DropdownOption {
	label: string;
	value: string;
	icon: ElementType;
}

interface DropdownFieldProps {
	id: string;
	label: string;
	value: string;
	icon: ElementType;
	options: DropdownOption[];
	onChange: (value: string) => void;
}

function DropdownField({
	id,
	label,
	value,
	icon: Icon,
	options,
	onChange,
}: DropdownFieldProps) {
	return (
		<div className="space-y-1">
			<Label className="block text-sm font-medium mb-2" htmlFor={id}>
				{label}
				<span className="text-red-500 ml-1">*</span>
			</Label>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						className="px-4 py-1.5 cursor-pointer min-w-48 capitalize flex items-center justify-start gap-2"
						variant="secondary"
						id={id}
					>
						<Icon className="h-4 w-4" />
						{value}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="z-9999 min-w-48 space-y-1"
					align="start"
				>
					{options.map((option) => {
						const OptionIcon = option.icon;
						return (
							<DropdownMenuItem
								key={option.value}
								onClick={() => onChange(option.value)}
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
	);
}
