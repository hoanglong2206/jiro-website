"use client";
import { useState, ReactNode } from "react";
import { Book, ChevronDown, Search, SquareCheck, Zap } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface SearchSelectProps {
	label: string;
	isRequired?: boolean;
	options: any[];
	value?: any;
	onChange?: (value: any) => void;
}

const iconTask: Record<string, ReactNode> = {
	task: <SquareCheck className="size-4 text-primary" />,
	epic: <Zap className="size-4 text-purple-400" />,
	story: <Book className="size-4 text-green-400" />,
};

export const SearchSelect = ({
	label,
	isRequired,
	options,
	value,
	onChange,
}: SearchSelectProps) => {
	const [selectItem, setSelectItem] = useState<any>(value || options[0]);
	const [searchItem, setSearchItem] = useState<string>("");
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const handleSelectItem = (item: any) => {
		setSelectItem(item);
		if (onChange) {
			onChange(item);
		}
		setIsOpen(false);
		setSearchItem("");
	};

	const filteredOptions = options.filter((option) => {
		if (typeof option === "string") {
			return option.toLowerCase().includes(searchItem.toLowerCase());
		} else {
			return (
				option.name?.toLowerCase().includes(searchItem.toLowerCase()) ||
				option.key?.toLowerCase().includes(searchItem.toLowerCase())
			);
		}
	});

	return (
		<div className="space-y-1 relative">
			<Label className="block text-sm font-medium mb-2" htmlFor={label}>
				{label} {isRequired && <span className="text-red-500">*</span>}
			</Label>
			<Popover open={isOpen} onOpenChange={setIsOpen}>
				<PopoverTrigger asChild>
					<button
						className="w-full flex items-center px-1 justify-between cursor-pointer hover:bg-sidebar-accent rounded-md border"
						id={label}
						type="button"
					>
						{selectItem ? (
							label === "Space" ? (
								<ItemSpaceSearch
									item={selectItem}
									isSelected={true}
								/>
							) : label === "Work Type" ? (
								<ItemWorkTypeSearch
									item={selectItem}
									isSelected={true}
								/>
							) : label === "Assignee" ? (
								<ItemAssigneeSearch
									item={selectItem}
									isSelected={true}
								/>
							) : (
								<span>Select an option</span>
							)
						) : (
							<span>Select an option</span>
						)}
						<ChevronDown className="h-4 w-4" />
					</button>
				</PopoverTrigger>
				{label === "Assignee" && (
					<div
						className="flex items-center absolute right-0 top-1"
						onClick={(e) => {
							e.stopPropagation();
						}}
					>
						<span className="text-sm text-blue-500 hover:underline cursor-pointer">
							Assign to me
						</span>
					</div>
				)}
				<PopoverContent
					side="bottom"
					align="start"
					className="w-70 p-0 z-9999"
				>
					<div className="p-3 space-y-2">
						<div className="relative w-full mb-2">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								value={searchItem}
								onChange={(e) => setSearchItem(e.target.value)}
								placeholder="Search"
								className="h-9 pl-9"
							/>
						</div>
						<div
							className={cn(
								"overflow-y-auto space-y-2",
								label === "Space" && "max-h-40",
								label === "Work Type" && "max-h-36",
								label === "Assignee" && "max-h-24"
							)}
						>
							{filteredOptions.map((option, index) =>
								label === "Space" ? (
									<ItemSpaceSearch
										key={index}
										item={option}
										onclick={() => handleSelectItem(option)}
										isNotInteractive={true}
										isSelected={selectItem === option}
									/>
								) : label === "Work Type" ? (
									<ItemWorkTypeSearch
										key={index}
										item={option}
										onclick={() => handleSelectItem(option)}
										isNotInteractive={true}
										isSelected={selectItem === option}
									/>
								) : label === "Assignee" ? (
									<ItemAssigneeSearch
										key={index}
										item={option}
										onclick={() => handleSelectItem(option)}
										isNotInteractive={true}
										isSelected={selectItem === option}
									/>
								) : null
							)}
						</div>
						{label === "Work Type" && (
							<div className="p-1 space-y-1">
								<div className="flex w-full items-center gap-3 px-3 py-2 cursor-pointer transition-colors rounded-md hover:bg-sidebar-accent">
									Add work type
								</div>
								<div className="flex w-full items-center gap-3 px-3 py-2 cursor-pointer transition-colors rounded-md hover:bg-sidebar-accent">
									Manage work types
								</div>
							</div>
						)}
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
};

interface ItemSearchProps {
	item: any;
	isSelected: boolean;
	onclick?: () => void;
	isNotInteractive?: boolean;
}

const ItemSpaceSearch = ({
	item,
	isSelected,
	onclick,
	isNotInteractive = false,
}: ItemSearchProps) => {
	return (
		<div
			onClick={onclick}
			className={`flex w-full items-center gap-3 px-3 py-2 cursor-pointer transition-colors rounded-md ${
				isNotInteractive &&
				(isSelected
					? "bg-primary/10 hover:bg-primary/20"
					: "hover:bg-sidebar-accent")
			}`}
		>
			<span
				className="flex h-6 w-6 items-center justify-center rounded text-xs"
				style={{
					backgroundColor: item.color,
				}}
			>
				{item.icon}
			</span>
			<span>
				{item.name}
				<span className="text-sm text-muted-foreground ml-1">
					({item.key})
				</span>
			</span>
		</div>
	);
};

const ItemWorkTypeSearch = ({
	item,
	isSelected,
	onclick,
	isNotInteractive = false,
}: ItemSearchProps) => {
	const icon = iconTask[item];
	return (
		<div
			onClick={onclick}
			className={`flex w-full items-center gap-3 px-3 py-2 cursor-pointer transition-colors rounded-md ${
				isNotInteractive &&
				(isSelected
					? "bg-primary/10 hover:bg-primary/20"
					: "hover:bg-sidebar-accent")
			}`}
		>
			{icon}
			<span className="capitalize">{item}</span>
		</div>
	);
};

const ItemAssigneeSearch = ({
	item,
	isSelected,
	onclick,
	isNotInteractive = false,
}: ItemSearchProps) => {
	return (
		<div
			onClick={onclick}
			className={`flex w-full items-center gap-3 px-3 py-1.5 cursor-pointer transition-colors rounded-md ${
				isNotInteractive &&
				(isSelected
					? "bg-primary/10 hover:bg-primary/20"
					: "hover:bg-sidebar-accent")
			}`}
		>
			<Avatar className="h-7 w-7">
				<AvatarImage src={item.avatar || "/placeholder.svg"} />
				<AvatarFallback className="text-xs">
					{item.name
						.split(" ")
						.map((n: any) => n[0])
						.join("")}
				</AvatarFallback>
			</Avatar>
			<span className="text-sm">{item.name}</span>
		</div>
	);
};
