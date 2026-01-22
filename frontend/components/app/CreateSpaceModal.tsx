"use client";

import { useState } from "react";
import { ModalStep } from "@/components/ui/modal-step";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Target, UsersRound } from "lucide-react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { ArrowRight, Circle, HelpCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import { WORKFLOW_CONFIG } from "@/types/project.interface";

export const CreateSpaceModal = ({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) => {
	const [spaceForm, setSpaceForm] = useState<{
		name: string;
		key: string;
		isKeyAuto: boolean;
	}>({
		name: "",
		key: "",
		isKeyAuto: true,
	});
	const [workflowType, setWorkflowType] = useState<
		| "starter"
		| "marketing-teams"
		| "project-management"
		| "product-engineering"
	>("starter");

	const handleFinish = () => {
		const space = {
			name: spaceForm.name.trim(),
			key: spaceForm.key.trim(),
		};

		const boards = WORKFLOW_CONFIG[workflowType].map((b, index) => ({
			label: b.label,
			color: b.color,
			position: index + 1,
		}));

		const payload = {
			space,
			boards,
		};
		console.log(payload);
	};

	return (
		<ModalStep
			size="xl:w-2xl w-sm"
			open={isOpen}
			onClose={onClose}
			onFinish={handleFinish}
			componentList={[
				{
					title: "Create Space",
					subtitle: "Basic information",
					component: (
						<StepCreateSpace
							value={spaceForm}
							onChange={setSpaceForm}
						/>
					),
					canNext: Boolean(spaceForm.name.trim() && spaceForm.key),
				},
				{
					title: "Define workflow",
					subtitle: "Choose how you work",
					component: (
						<StepWorkflow
							value={workflowType}
							onChange={setWorkflowType}
						/>
					),
				},
			]}
		/>
	);
};

function StepCreateSpace({
	value,
	onChange,
}: {
	value: {
		name: string;
		key: string;
		isKeyAuto: boolean;
	};
	onChange: (value: {
		name: string;
		key: string;
		isKeyAuto: boolean;
	}) => void;
}) {
	const generateKeyFromName = (name: string) => {
		return name
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.trim()
			.split(/\s+/)
			.map((word) => word[0])
			.join("")
			.toUpperCase();
	};

	const handleNameChange = (name: string) => {
		onChange({
			...value,
			name,
			key: value.isKeyAuto ? generateKeyFromName(name) : value.key,
		});
	};

	const handleKeyChange = (key: string) => {
		onChange({
			...value,
			key: key.toUpperCase(),
			isKeyAuto: false,
		});
	};

	return (
		<div className="space-y-4">
			<div className="space-y-1">
				<Label
					className="block text-sm font-medium mb-2"
					htmlFor="name"
				>
					Name<span className="text-red-500 ml-1">*</span>
				</Label>
				<Input
					className="h-9"
					id="name"
					placeholder="Project name"
					value={value.name}
					onChange={(e) => handleNameChange(e.target.value)}
				/>
			</div>

			<div className="flex flex-col xl:flex-row items-center justify-between gap-4 w-full">
				<div className="space-y-1 w-full">
					<Label
						className="block text-sm font-medium mb-2"
						htmlFor="key"
					>
						Key<span className="text-red-500 ml-1">*</span>
					</Label>
					<Input
						className="h-9 w-full"
						id="key"
						placeholder="Enter key"
						required
						value={value.key}
						onChange={(e) => handleKeyChange(e.target.value)}
					/>
				</div>
				<div className="space-y-1 w-full">
					<Label
						className="block text-sm font-medium mb-2"
						htmlFor="permission"
					>
						Permission
					</Label>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								className="px-4 py-1.5 cursor-pointer w-full capitalize flex items-center justify-start gap-2 focus-visible:ring-0"
								variant="secondary"
							>
								<UsersRound className="h-4 w-4" />
								Full edit
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="z-9999 max-w-72 xl:max-w-60 space-y-1"
							align="start"
						>
							{[
								{
									label: "Full edit",
									value: "full-edit",
									description:
										"Can create and edit entities in this Space. Owner and admin can manage Space setting",
								},
								{
									label: "View only",
									value: "view-only",
									description:
										"Read-only. Can't create or edit entities in this Space.",
								},
							].map((option) => {
								return (
									<DropdownMenuItem
										key={option.value}
										className="cursor-pointer flex items-center gap-2 hover:bg-muted/90 transition-colors"
									>
										<div>
											<p className="text-sm font-medium">
												{option.label}
											</p>
											<span className="text-xs text-muted-foreground">
												{option.description}
											</span>
										</div>
									</DropdownMenuItem>
								);
							})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>
	);
}

function StepWorkflow({
	value,
	onChange,
}: {
	value: keyof typeof WORKFLOW_CONFIG;
	onChange: (v: keyof typeof WORKFLOW_CONFIG) => void;
}) {
	const workflows: {
		label: string;
		value:
			| "starter"
			| "marketing-teams"
			| "project-management"
			| "product-engineering";
		description: string;
	}[] = [
		{
			label: "Starter",
			value: "starter",
			description: "For everyday tasks",
		},
		{
			label: "Marketing Teams",
			value: "marketing-teams",
			description: "Run effective campaigns",
		},
		{
			label: "Project Management",
			value: "project-management",
			description: "Plan, manage, and execute projects",
		},
		{
			label: "Product + Engineering",
			value: "product-engineering",
			description: "Streamline	your product lifecycle",
		},
	];

	const statusList = WORKFLOW_CONFIG[value];
	const workflow = value;

	const MAX_DISPLAY = 3;
	const shouldTruncate = statusList.length > MAX_DISPLAY;
	const displayList = shouldTruncate
		? statusList.slice(0, MAX_DISPLAY)
		: statusList;

	return (
		<div className="space-y-8">
			<div className="grid xl:grid-cols-2 grid-cols-1 gap-4">
				{workflows.map((wf) => {
					return (
						<Card
							key={wf.value}
							className={cn(
								"cursor-pointer h-24 py-4 transition-colors hover:bg-accent",
								wf.value === workflow &&
									"bg-accent hover:bg-accent-foreground/10",
							)}
							onClick={() => onChange(wf.value)}
						>
							<CardHeader>
								<CardTitle className="text-lg font-medium">
									{wf.label}
								</CardTitle>
								<CardDescription className="text-sm text-gray-600">
									{wf.description}
								</CardDescription>
							</CardHeader>
						</Card>
					);
				})}
			</div>
			<Separator className="mb-4" />
			<h3 className="font-medium mb-4 capitalize">
				Customize defaults for {workflow.replace(/-/g, " ")}
			</h3>
			<div className="flex items-center justify-between border rounded-md py-3 px-4">
				<div className="flex items-center gap-4">
					<div className="p-2 border rounded-md">
						<Target className="w-6 h-6" />
					</div>
					<div className="space-y-1">
						<p className="text-sm font-medium">Task statuses</p>
						<div className="flex items-center text-sm flex-nowrap">
							{displayList.map((status, index) => {
								const isLastItem =
									index === displayList.length - 1;

								return (
									<div
										key={status.label}
										className="flex items-center"
									>
										<Badge
											variant="outline"
											className="whitespace-nowrap"
											style={{
												borderColor: status.color,
												color: status.color,
											}}
										>
											<Circle
												className="w-3 h-3 mr-1 stroke-none"
												style={{ fill: status.color }}
											/>{" "}
											{status.label}
										</Badge>

										{!isLastItem && (
											<ArrowRight className="w-4 h-4 mx-1 text-muted-foreground shrink-0" />
										)}

										{isLastItem && shouldTruncate && (
											<>
												<ArrowRight className="w-4 h-4 mx-1 text-muted-foreground shrink-0" />
												<MoreHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
											</>
										)}
									</div>
								);
							})}
						</div>
					</div>
				</div>

				<HelpCircle className="w-4 h-4 text-muted-foreground" />
			</div>
		</div>
	);
}
