"use client";

import {
	useEffect,
	useRef,
	useState,
	forwardRef,
	useImperativeHandle,
	type KeyboardEvent,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColorPicker } from "@/components/app/ColorPicker";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputWithColorPickerProps {
	value: string;
	onValueChange: (value: string) => void;
	color: string;
	onColorChange: (value: string) => void;
	onSubmit: () => void;
	onCancel?: () => void;
	placeholder?: string;
	className?: string;
	autoFocus?: boolean;
	colorFallback?: string;
	isSubmitting?: boolean;
}

export interface InputWithColorPickerHandle {
	focus: () => void;
	select: () => void;
	getFormElement: () => HTMLFormElement | null;
	getDropdownContentElement: () => HTMLDivElement | null;
	isColorPickerOpen: () => boolean;
}

export const InputWithColorPicker = forwardRef<
	InputWithColorPickerHandle,
	InputWithColorPickerProps
>(
	(
		{
			value,
			onValueChange,
			color,
			onColorChange,
			onSubmit,
			onCancel,
			placeholder = "",
			className,
			autoFocus = false,
			colorFallback = "#d1d5db",
			isSubmitting = false,
		},
		ref,
	) => {
		const formRef = useRef<HTMLFormElement | null>(null);
		const inputRef = useRef<HTMLInputElement | null>(null);
		const dropdownContentRef = useRef<HTMLDivElement | null>(null);
		const [isColorPickerOpen, setIsColorPickerOpen] = useState<boolean>(false);

		useEffect(() => {
			if (!autoFocus) {
				return;
			}
			inputRef.current?.focus();
			inputRef.current?.select();
		}, [autoFocus]);

		useEffect(() => {
			const handlePointerDown = (event: PointerEvent) => {
				if (isColorPickerOpen) {
					return;
				}
				if (!(event.target instanceof Node)) {
					return;
				}
				const formElement = formRef.current;
				const dropdownElement = dropdownContentRef.current;
				const isInsideForm = formElement?.contains(event.target) ?? false;
				const isInsideDropdown =
					dropdownElement?.contains(event.target) ?? false;
				if (isInsideForm || isInsideDropdown) {
					return;
				}
				onCancel?.();
			};
			document.addEventListener("pointerdown", handlePointerDown);
			return () => {
				document.removeEventListener("pointerdown", handlePointerDown);
			};
		}, [isColorPickerOpen, onCancel]);

		const handleKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
			if (event.key === "Escape") {
				event.preventDefault();
				onCancel?.();
			}
		};

		useImperativeHandle(
			ref,
			() => ({
				focus: () => {
					inputRef.current?.focus();
				},
				select: () => {
					inputRef.current?.select();
				},
				getFormElement: () => formRef.current,
				getDropdownContentElement: () => dropdownContentRef.current,
				isColorPickerOpen: () => isColorPickerOpen,
			}),
			[isColorPickerOpen],
		);

		return (
			<form
				ref={formRef}
				onSubmit={(event) => {
					event.preventDefault();
					onSubmit();
				}}
				onKeyDown={handleKeyDown}
				className={cn(
					"flex flex-1 items-center border border-border px-1 bg-background rounded-md",
					className,
				)}
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
							style={{ backgroundColor: color || colorFallback }}
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
						<ColorPicker value={color} onChange={onColorChange} />
					</DropdownMenuContent>
				</DropdownMenu>
				<Input
					ref={inputRef}
					value={value}
					onChange={(event) => onValueChange(event.target.value)}
					placeholder={placeholder}
					className="h-8 text-sm border-0 focus-visible:ring-0 shadow-none"
				/>
				<Button
					type="submit"
					variant="ghost"
					size="icon"
					className="h-6 w-6 cursor-pointer"
					disabled={isSubmitting}
				>
					{isSubmitting ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<Check className="h-4 w-4" />
					)}
				</Button>
			</form>
		);
	},
);

InputWithColorPicker.displayName = "InputWithColorPicker";
