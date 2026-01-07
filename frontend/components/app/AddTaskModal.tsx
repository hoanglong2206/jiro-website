"use client";
import { useState } from "react";
import { CustomModal } from "@/components/ui/modal";
import { SearchSelect } from "@/components/app";
import { projects, users } from "@/lib/data";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuItem,
	DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface AddTaskModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const colorTaskStatus: Record<string, string> = {
	todo: "bg-red-100 text-red-600",
	"in-progress": "bg-yellow-100 text-yellow-600",
	"in-review": "bg-blue-100 text-blue-600",
	done: "bg-green-100 text-green-600",
};

type TaskStatus = "todo" | "in-progress" | "in-review" | "done";

export const AddTaskModal = ({ isOpen, onClose }: AddTaskModalProps) => {
	const [statusTask, setStatusTask] = useState<TaskStatus>("todo");
	const [selectedSpace, setSelectedSpace] = useState<any>(projects[0]);
	const [selectedWorkType, setSelectedWorkType] = useState<string>("task");
	const [selectedAssignee, setSelectedAssignee] = useState<any>(users[0]);
	const [summary, setSummary] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [startDate, setStartDate] = useState<Date>(new Date("2025-06-01"));
	const [dueDate, setDueDate] = useState<Date>(new Date("2025-06-01"));

	const handleAddTask = (e: React.FormEvent) => {
		e.preventDefault();

		const taskData = {
			space: selectedSpace,
			workType: selectedWorkType,
			summary: summary,
			description: description,
			assignee: selectedAssignee,
			status: statusTask,
			startDate: formatDate(startDate),
			dueDate: formatDate(dueDate),
		};

		console.log("Task Information:", taskData);
	};

	return (
		<CustomModal
			open={isOpen}
			onClose={onClose}
			size="xl:min-w-2xl xl:h-165"
		>
			<div className="flex h-full flex-col gap-8 px-4">
				<h2 className="text-xl font-semibold">Add New Task</h2>
				<form className="space-y-8" onSubmit={handleAddTask}>
					<div className="grid md:grid-cols-2 items-center gap-x-8">
						<SearchSelect
							label="Space"
							isRequired
							options={projects}
							value={selectedSpace}
							onChange={setSelectedSpace}
						/>
						<SearchSelect
							label="Work Type"
							isRequired
							options={["task", "epic", "story"]}
							value={selectedWorkType}
							onChange={setSelectedWorkType}
						/>
					</div>
					<div className="space-y-1">
						<Label
							className="block text-sm font-medium mb-2"
							htmlFor="summary"
						>
							Summary
							<span className="text-red-500">*</span>
						</Label>
						<Input
							className="h-9"
							id="summary"
							value={summary}
							onChange={(e) => setSummary(e.target.value)}
						/>
					</div>
					<div className="space-y-1">
						<Label
							className="block text-sm font-medium mb-2"
							htmlFor="description"
						>
							Description
						</Label>
						<Textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>
					<div className="grid md:grid-cols-2 items-center gap-x-8">
						<SearchSelect
							label="Assignee"
							isRequired
							options={users}
							value={selectedAssignee}
							onChange={setSelectedAssignee}
						/>
						<div className="space-y-1 mb-2">
							<Label
								className="block text-sm font-medium mb-2"
								htmlFor="status"
							>
								Status
							</Label>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										className={`px-4 py-1.5 cursor-pointer min-w-20 capitalize ${colorTaskStatus[statusTask]}`}
										variant={"secondary"}
										id="status"
									>
										{statusTask.replace(/-/g, " ")}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="z-9999">
									<DropdownMenuItem
										className="cursor-pointer"
										onClick={() => setStatusTask("todo")}
									>
										<Badge
											variant="secondary"
											className="bg-red-100 text-red-600"
										>
											Todo
										</Badge>
									</DropdownMenuItem>
									<DropdownMenuItem
										className="cursor-pointer"
										onClick={() =>
											setStatusTask("in-progress")
										}
									>
										<Badge
											variant="secondary"
											className="bg-yellow-100 text-yellow-600"
										>
											In Progress
										</Badge>
									</DropdownMenuItem>
									<DropdownMenuItem
										className="cursor-pointer"
										onClick={() =>
											setStatusTask("in-review")
										}
									>
										<Badge
											variant="secondary"
											className="bg-blue-100 text-blue-600"
										>
											In Review
										</Badge>
									</DropdownMenuItem>
									<DropdownMenuItem
										className="cursor-pointer"
										onClick={() => setStatusTask("done")}
									>
										<Badge
											variant="secondary"
											className="bg-green-100 text-green-600"
										>
											Done
										</Badge>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
					<div className="grid md:grid-cols-2 items-center gap-x-8">
						<DatePicker
							label="Start date"
							value={startDate}
							onChange={setStartDate}
						/>
						<DatePicker
							label="Due date"
							value={dueDate}
							onChange={setDueDate}
						/>
					</div>
					<div className="flex items-center justify-end">
						<Button
							className="gap-2 cursor-pointer flex w-full md:w-auto"
							type="submit"
						>
							Create
						</Button>
					</div>
				</form>
			</div>
		</CustomModal>
	);
};

function isValidDate(date: Date | undefined) {
	if (!date) {
		return false;
	}
	return !isNaN(date.getTime());
}

interface DatePickerProps {
	label: string;
	value: Date;
	onChange: (date: Date) => void;
}

const DatePicker = ({ label, value, onChange }: DatePickerProps) => {
	const [open, setOpen] = useState(false);
	const [month, setMonth] = useState<Date>(value);
	const [inputValue, setInputValue] = useState(formatDate(value));

	return (
		<div className="flex flex-col gap-3">
			<Label htmlFor={label} className="px-1">
				{label}
			</Label>
			<div className="relative flex gap-2">
				<Input
					id={label}
					value={inputValue}
					placeholder="Select date"
					className="bg-background pr-10"
					onChange={(e) => {
						setInputValue(e.target.value);
						const date = new Date(e.target.value);
						if (isValidDate(date)) {
							onChange(date);
						}
					}}
				/>
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							id="date-picker"
							variant="ghost"
							className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
						>
							<CalendarIcon className="size-3.5" />
							<span className="sr-only">Select date</span>
						</Button>
					</PopoverTrigger>
					<PopoverContent
						className="w-auto overflow-hidden p-0 z-9999"
						align="end"
						alignOffset={-8}
						sideOffset={10}
					>
						<Calendar
							mode="single"
							selected={value}
							captionLayout="dropdown"
							month={month}
							onMonthChange={setMonth}
							onSelect={(date) => {
								if (date) {
									onChange(date);
									setInputValue(formatDate(date));
									setOpen(false);
								}
							}}
						/>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
};
