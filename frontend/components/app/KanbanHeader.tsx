"use client";

import { CheckCheck, MoreHorizontal, Pen, Target, Trash2 } from "lucide-react";
import { useState, type HTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputWithColorPicker } from "@/components/app/InputWithColorPicker";
import { cn } from "@/lib/utils";

interface KanbanHeaderProps {
	title: string;
	color?: string | null;
	taskCount: number;
	dragHandleProps?: HTMLAttributes<HTMLDivElement>;
	onUpdate?: (payload: {
		name?: string;
		color?: string | null;
	}) => Promise<void> | void;
	isUpdating?: boolean;
}

export const KanbanHeader = ({
	title,
	color,
	taskCount,
	dragHandleProps,
	onUpdate,
	isUpdating = false,
}: KanbanHeaderProps) => {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [draftTitle, setDraftTitle] = useState<string>(title);
	const [draftColor, setDraftColor] = useState<string>(color ?? "");
	const [isSaving, setIsSaving] = useState<boolean>(false);

	const handleStartEditing = () => {
		if (isUpdating) {
			return;
		}
		setDraftTitle(title);
		setDraftColor(color ?? "");
		setIsEditing(true);
	};

	const handleCancelEditing = () => {
		if (isSaving) {
			return;
		}
		setDraftTitle(title);
		setDraftColor(color ?? "");
		setIsEditing(false);
	};

	const handleSubmit = async () => {
		const trimmedTitle = draftTitle.trim();
		if (!trimmedTitle) {
			return;
		}
		const normalizedColor = draftColor.trim() ? draftColor.trim() : "";
		const currentColor = color ?? "";
		const hasChanges =
			trimmedTitle !== title || normalizedColor !== currentColor;
		if (!onUpdate) {
			setDraftTitle(trimmedTitle);
			setIsEditing(false);
			return;
		}
		if (!hasChanges) {
			setIsEditing(false);
			return;
		}
		try {
			setIsSaving(true);
			await onUpdate({
				name: trimmedTitle,
				color: normalizedColor ? normalizedColor : null,
			});
			setDraftTitle(trimmedTitle);
			setDraftColor(normalizedColor);
			setIsEditing(false);
		} catch (error) {
			console.error("Failed to update board", error);
		} finally {
			setIsSaving(false);
		}
	};
	return (
		<div className="px-3 py-2 flex items-center justify-between bg-sidebar rounded-md">
			{isEditing ? (
				<InputWithColorPicker
					autoFocus
					value={draftTitle}
					onValueChange={setDraftTitle}
					color={draftColor}
					onColorChange={setDraftColor}
					onSubmit={() => {
						void handleSubmit();
					}}
					onCancel={handleCancelEditing}
					placeholder="Board name"
					isSubmitting={isSaving || isUpdating}
				/>
			) : (
				<div
					className="flex flex-1 items-center gap-x-2 cursor-grab active:cursor-grabbing"
					{...dragHandleProps}
				>
					<span
						className="h-2.5 w-2.5 rounded-full"
						style={{ backgroundColor: color || "#d1d5db" }}
					/>
					<h2 className="text-sm font-medium capitalize">{title}</h2>
					<div className="size-5 flex items-center justify-center rounded-full text-xs bg-neutral-200 text-neutral-800 font-medium">
						{taskCount}
					</div>
				</div>
			)}
			<DropdownMenu>
				<Tooltip>
					<TooltipTrigger asChild>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className={cn(
									"cursor-pointer size-7",
									(isEditing || isSaving || isUpdating) && "hidden",
								)}
							>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
					</TooltipTrigger>
					<TooltipContent side="bottom">
						<p>More actions</p>
					</TooltipContent>
				</Tooltip>
				<DropdownMenuContent
					align="start"
					className={cn("w-40", isEditing && "hidden")}
				>
					<DropdownMenuItem onSelect={handleStartEditing}>
						<Pen className="h-4 w-4" />
						Rename
					</DropdownMenuItem>
					<DropdownMenuItem>
						<CheckCheck className="h-4 w-4" />
						Select all
					</DropdownMenuItem>
					<DropdownMenuItem disabled>
						<Target className="h-4 w-4" />
						Edit status
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="text-destructive focus:text-destructive">
						<Trash2 className="h-4 w-4" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
