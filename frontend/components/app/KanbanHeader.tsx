"use client";

import {
	CheckCheck,
	MoreHorizontal,
	Pen,
	Target,
	Trash2,
	Check,
} from "lucide-react";
import {
	useEffect,
	useRef,
	useState,
	type HTMLAttributes,
	type KeyboardEvent,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ColorPicker } from "@/components/app/ColorPicker";
import { cn } from "@/lib/utils";

interface KanbanHeaderProps {
	title: string;
	color?: string | null;
	taskCount: number;
	dragHandleProps?: HTMLAttributes<HTMLDivElement>;
}

export const KanbanHeader = ({
	title,
	color,
	taskCount,
	dragHandleProps,
}: KanbanHeaderProps) => {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [draftTitle, setDraftTitle] = useState<string>(title);
	const [draftColor, setDraftColor] = useState<string>(color ?? "");
	const [isColorPickerOpen, setIsColorPickerOpen] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const dropdownContentRef = useRef<HTMLDivElement | null>(null);
	const isColorPickerOpenRef = useRef<boolean>(false);

	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [isEditing]);

	useEffect(() => {
		isColorPickerOpenRef.current = isColorPickerOpen;
	}, [isColorPickerOpen]);

	useEffect(() => {
		if (!isEditing) {
			return;
		}
		const handlePointerDown = (event: PointerEvent) => {
			if (isColorPickerOpenRef.current) {
				return;
			}
			if (!(event.target instanceof Node)) {
				return;
			}
			if (formRef.current?.contains(event.target)) {
				return;
			}
			if (dropdownContentRef.current?.contains(event.target)) {
				return;
			}
			setDraftTitle(title);
			setDraftColor(color ?? "");
			setIsEditing(false);
			setIsColorPickerOpen(false);
		};
		document.addEventListener("pointerdown", handlePointerDown);
		return () => {
			document.removeEventListener("pointerdown", handlePointerDown);
		};
	}, [isEditing, title, color]);

	const handleStartEditing = () => {
		setDraftTitle(title);
		setDraftColor(color ?? "");
		setIsEditing(true);
	};

	const handleCancelEditing = () => {
		setDraftTitle(title);
		setDraftColor(color ?? "");
		setIsEditing(false);
		setIsColorPickerOpen(false);
	};

	const handleSubmit = () => {
		const trimmedTitle = draftTitle.trim();
		if (!trimmedTitle) {
			return;
		}
		setIsEditing(false);
		setIsColorPickerOpen(false);
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
		if (event.key === "Escape") {
			event.preventDefault();
			handleCancelEditing();
		}
	};
	return (
		<div className="px-3 py-2 flex items-center justify-between bg-sidebar rounded-md">
			{isEditing ? (
				<form
					ref={formRef}
					onSubmit={(event) => {
						event.preventDefault();
						handleSubmit();
					}}
					onKeyDown={handleKeyDown}
					className="flex flex-1 items-center border border-border px-1 bg-background rounded-md"
				>
					<DropdownMenu
						open={isColorPickerOpen}
						onOpenChange={setIsColorPickerOpen}
					>
						<DropdownMenuTrigger asChild>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="size-6 rounded-md border border-border cursor-pointer"
								style={{
									backgroundColor: draftColor || "#d1d5db",
								}}
							>
								<span className="sr-only">Select color</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							ref={dropdownContentRef}
							className="min-w-32 rounded-lg px-2"
							align="start"
							side="bottom"
							sideOffset={4}
						>
							<ColorPicker value={draftColor} onChange={setDraftColor} />
						</DropdownMenuContent>
					</DropdownMenu>
					<Input
						ref={inputRef}
						value={draftTitle}
						onChange={(event) => setDraftTitle(event.target.value)}
						placeholder="Board name"
						className="h-8 text-sm border-0 focus-visible:ring-0 shadow-none"
					/>
					<Button
						type="submit"
						variant="ghost"
						size="icon"
						className="h-6 w-6 cursor-pointer"
					>
						<Check className="h-4 w-4" />
					</Button>
				</form>
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
								className={cn("cursor-pointer size-7", isEditing && "hidden")}
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
