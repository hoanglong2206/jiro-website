"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CustomModal } from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import { IUser } from "@/types/user.interface";
import { Grid2X2, List, Search, X } from "lucide-react";
import { useRef, useState } from "react";

const users: IUser[] = [
	{
		id: "1",
		name: "John Doe",
		username: "johndoe",
		email: "john@example.com",
		colorAvatar: "bg-blue-400",
	},
	{
		id: "2",
		name: "Jane Smith",
		username: "janesmith",
		email: "jane@example.com",
		colorAvatar: "bg-green-400",
	},
];

const PeoplePage = () => {
	const [typeList, setTypeList] = useState<"grid" | "list">("grid");
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	return (
		<>
			<div className="flex-1 overflow-auto bg-background h-full">
				<div className="mx-auto px-4 md:px-8 space-y-4 py-1">
					<div className="relative w-full">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Search"
							className="h-10 pl-9 focus-visible:ring-primary"
						/>
					</div>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								className="cursor-pointer bg-transparent"
							>
								Teams
							</Button>
							<Button
								variant="outline"
								className="cursor-pointer bg-transparent"
							>
								Job title
							</Button>
						</div>
						<Button
							onClick={() => setIsModalOpen(true)}
							variant="outline"
							className="cursor-pointer bg-transparent"
						>
							Add people
						</Button>
					</div>
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-medium text-foreground">People</h2>
						<ButtonGroup className="h-fit">
							<Button
								variant="outline"
								size="icon"
								className={cn(
									"cursor-pointer",
									typeList === "grid" &&
										"bg-primary/30 text-primary/60 hover:text-primary/70 border-primary hover:bg-primary/50",
								)}
								onClick={() => setTypeList("grid")}
							>
								<Grid2X2 />
							</Button>
							<Button
								variant="outline"
								size="icon"
								className={cn(
									"cursor-pointer",
									typeList === "list" &&
										"bg-primary/30 text-primary/60 hover:text-primary/70 border-primary border hover:bg-primary/50",
								)}
								onClick={() => setTypeList("list")}
							>
								<List />
							</Button>
						</ButtonGroup>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2">
						{users.map((user) => (
							<PersonItem key={user.id} user={user} />
						))}
					</div>
				</div>
			</div>
			<AddPersonModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</>
	);
};

export default PeoplePage;

const PersonItem = ({ user }: { user: IUser }) => {
	return (
		<div className="w-48 sm:w-52 h-20 rounded-md flex items-center border border-border py-1 hover:shadow-md transition-shadow cursor-pointer">
			<div
				className={`flex rounded-l-md items-center justify-center text-white font-medium tracking-wider text-2xl h-20 w-20 ${user.colorAvatar}`}
			>
				{user.name
					.split(" ")
					.map((x) => x[0])
					.join("")}
			</div>

			<div className="px-4">{user.name}</div>
		</div>
	);
};

export const AddPersonModal = ({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) => {
	const [searchValue, setSearchValue] = useState<string>("");
	const [isFocused, setIsFocused] = useState<boolean>(false);
	const [people, setPeople] = useState<IUser[]>(users);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleAddPerson = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Search value:", searchValue);
	};

	const suggestedUsers = users.filter(
		(user) =>
			!people.some((people) => people.id === user.id) &&
			(user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
				user.name.toLowerCase().includes(searchValue.toLowerCase())),
	);

	const addPeople = (user: IUser) => {
		setPeople((prevPeople) => [...prevPeople, user]);
		setSearchValue("");
		inputRef.current?.focus();
	};

	const removePeople = (
		memberId: string,
		e: React.MouseEvent<HTMLButtonElement>,
	) => {
		e.preventDefault();
		e.stopPropagation();
		setPeople((prevPeople) =>
			prevPeople.filter((person) => person.id !== memberId),
		);
		inputRef.current?.focus();
	};
	return (
		<CustomModal open={isOpen} onClose={onClose} size="w-100">
			<div className="flex h-full flex-col gap-8 px-4">
				<h2 className="text-xl font-semibold">Add people</h2>
				<form className="space-y-8" onSubmit={handleAddPerson}>
					<div className="space-y-1">
						<Label className="block text-sm font-medium mb-2" htmlFor="search">
							Name or email
							<span className="text-red-500">*</span>
						</Label>
						<div
							className={`border rounded-md flex flex-wrap gap-1 items-center px-1 transition-colors ${
								isFocused
									? "border-ring ring-ring/50 ring-[3px]"
									: "border-gray-300"
							}`}
						>
							{people.map((person) => (
								<div
									key={person.id}
									className="flex items-center gap-1 px-2 py-1.5 rounded-full text-sm bg-primary/10"
								>
									<div
										className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${person.colorAvatar}`}
									>
										{person.name
											.split(" ")
											.map((x) => x[0])
											.join("")}
									</div>
									<span className="text-primary/80">{person.name}</span>
									<button
										type="button"
										onClick={(e) => removePeople(person.id, e)}
										className="ml-1 hover:bg-blue-100 rounded-full p-0.5 cursor-pointer text-primary/80"
									>
										<X className="w-3 h-3" />
									</button>
								</div>
							))}
							<Input
								id="members"
								type="text"
								value={searchValue}
								ref={inputRef}
								onFocus={() => setIsFocused(true)}
								onBlur={() => setIsFocused(false)}
								onChange={(e) => setSearchValue(e.target.value)}
								placeholder="Enter more"
								className="border-none flex-1 min-w-30 outline-none text-sm shadow-none focus-visible:ring-0 py-0"
							/>
						</div>
						{isFocused && (
							<div className="w-80 p-0 z-9999 absolute border rounded-md bg-background shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
								{!searchValue ? (
									<div className="p-3 text-sm text-muted-foreground">
										Enter an email address
									</div>
								) : suggestedUsers.length > 0 ? (
									<div className="overflow-y-auto max-h-48 space-y-1">
										{suggestedUsers.map((user) => (
											<div
												key={user.id}
												onMouseDown={(e) => {
													e.preventDefault(); // Ngăn input bị blur
													addPeople(user);
												}}
												className="px-2 py-1.5 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
											>
												<div
													className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${user.colorAvatar}`}
												>
													{user.name
														.split(" ")
														.map((x) => x[0])
														.join("")}
												</div>
												<div>
													<div className="text-sm font-medium">{user.name}</div>
													<div className="text-xs text-muted-foreground">
														{user.email}
													</div>
												</div>
											</div>
										))}
									</div>
								) : (
									<div className="p-3 text-sm text-muted-foreground">
										No users found
									</div>
								)}
							</div>
						)}
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
