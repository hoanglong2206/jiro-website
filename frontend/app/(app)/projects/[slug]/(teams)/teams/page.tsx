"use client";

import { Button } from "@/components/ui/button";
import { Plus, Users, X } from "lucide-react";
import { useRef, useState } from "react";
import { CustomModal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IUser } from "@/types/user.interface";

const TeamsPage = () => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	return (
		<>
			<div className="flex flex-col h-full bg-background">
				<div className="max-w-md text-center mx-auto my-auto">
					<div className="mb-6 flex justify-center">
						<div className="relative">
							<div className="w-24 h-24 rounded-2xl flex items-center bg-sidebar-accent justify-center -rotate-12">
								<Users className="w-12 h-12" />
							</div>
							<div className="absolute -bottom-2 -right-5 w-12 h-12 bg-primary/80 text-accent rounded-full flex items-center justify-center">
								<Plus className="w-6 h-6" />
							</div>
						</div>
					</div>

					<h2 className="text-2xl font-semibold mb-3">
						Bring everyone together onto one team
					</h2>
					<p className="text-muted-foreground mb-8 font-medium">
						Don&apos;t go it alone—create a team to start connecting
						work across apps and celebrating your collective
						success.
					</p>
					<Button
						onClick={() => setIsModalOpen(true)}
						className="cursor-pointer"
					>
						Create team
					</Button>
				</div>
			</div>
			<CreateTeamModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</>
	);
};

export default TeamsPage;

export const CreateTeamModal = ({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) => {
	const [nameTeam, setNameTeam] = useState<string>("");
	const [members, setMembers] = useState<IUser[]>([
		{
			id: "1",
			fullname: "John Doe",
			username: "johndoe",
			email: "john@example.com",
			profilePicture: "",
			jobTitle: "Software Engineer",
			colorAvatar: "bg-blue-400",
		},
	]);
	const [searchValue, setSearchValue] = useState<string>("");
	const [isFocused, setIsFocused] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleCreateTeam = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Search value:", searchValue);
	};

	const removeMember = (
		memberId: string,
		e: React.MouseEvent<HTMLButtonElement>
	) => {
		e.preventDefault();
		e.stopPropagation();
		setMembers((prevMembers) =>
			prevMembers.filter((member) => member.id !== memberId)
		);
		inputRef.current?.focus();
	};

	const addMember = (user: IUser) => {
		setMembers((prevMembers) => [...prevMembers, user]);
		setSearchValue("");
		inputRef.current?.focus();
	};

	const allUsers: IUser[] = [
		{
			id: "2",
			fullname: "Jane Smith",
			username: "janesmith",
			email: "jane@example.com",
			profilePicture: "",
			jobTitle: "Product Manager",
			colorAvatar: "bg-green-400",
		},
		{
			id: "3",
			fullname: "Bob Johnson",
			username: "bobjohnson",
			email: "bob@example.com",
			profilePicture: "",
			jobTitle: "Software Engineer",
			colorAvatar: "bg-purple-400",
		},
		{
			id: "4",
			fullname: "Alice Williams",
			username: "alicew",
			email: "alice@example.com",
			profilePicture: "",
			jobTitle: "Marketing Specialist",
			colorAvatar: "bg-pink-400",
		},
	];

	const suggestedUsers = allUsers.filter(
		(user) =>
			!members.some((member) => member.id === user.id) &&
			((user.email || "")
				.toLowerCase()
				.includes(searchValue.toLowerCase()) ||
				(user.fullname || "")
					.toLowerCase()
					.includes(searchValue.toLowerCase()))
	);

	return (
		<CustomModal open={isOpen} onClose={onClose} size="w-100">
			<div className="flex h-full flex-col gap-8 px-4">
				<h2 className="text-xl font-semibold">Create team</h2>
				<div className="space-y-4">
					<div className="space-y-1">
						<Label
							className="w-fit text-sm font-medium mb-2"
							htmlFor="name"
						>
							Name
							<span className="text-red-500">*</span>
						</Label>
						<Input
							className="h-9"
							id="name"
							type="text"
							placeholder="Team name"
							value={nameTeam}
							onChange={(e) => setNameTeam(e.target.value)}
						/>
					</div>
					<div className="space-y-1">
						<Label
							className="w-fit text-sm font-medium mb-2"
							htmlFor="members"
						>
							Add members
							<span className="text-red-500">*</span>
						</Label>
						<div
							className={`border rounded-md flex flex-wrap gap-1 items-center px-1 transition-colors ${
								isFocused
									? "border-ring ring-ring/50 ring-[3px]"
									: "border-gray-300"
							}`}
						>
							{members.map((member) => (
								<div
									key={member.id}
									className="flex items-center gap-1 px-2 py-1.5 rounded-full text-sm bg-primary/10"
								>
									<div
										className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${member.colorAvatar}`}
									>
										{(member.fullname || "")
											.split(" ")
											.map((x) => x[0])
											.join("")}
									</div>
									<span className="text-primary/80">
										{member.fullname}
									</span>
									<button
										type="button"
										onClick={(e) =>
											removeMember(member.id || "", e)
										}
										className="ml-1 hover:bg-primary/20 rounded-full p-0.5 cursor-pointer text-primary/80"
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
													e.preventDefault();
													addMember(user);
												}}
												className="px-2 py-1.5 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
											>
												<div
													className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${user.colorAvatar}`}
												>
													{(user.fullname || "")
														.split(" ")
														.map((x) => x[0])
														.join("")}
												</div>
												<div>
													<div className="text-sm font-medium">
														{user.fullname}
													</div>
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
							onClick={handleCreateTeam}
						>
							Add
						</Button>
					</div>
				</div>
			</div>
		</CustomModal>
	);
};
