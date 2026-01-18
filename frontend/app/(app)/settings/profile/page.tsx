"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	startTransition,
	useEffect,
	useState,
	type ChangeEvent,
	type CSSProperties,
	type FormEvent,
} from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Upload } from "lucide-react";
import { CustomModal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useUpdateUserMutation } from "@/services/user.service";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { updateUser as updateUserAction } from "@/store/reducers/user.reducer";
import { extractErrorMessage } from "@/services/utils.service";
import { toast } from "sonner";

const colorList: { label: string; value: string }[] = [
	{ label: "Red", value: "#f87171" },
	{ label: "Orange", value: "#fdba74" },
	{ label: "Yellow", value: "#fce94f" },
	{ label: "Blue", value: "#7dd3fc" },
	{ label: "Gray", value: "#9ca3af" },
	{ label: "Purple", value: "#c084fc" },
	{ label: "Fuchsia", value: "#e879f9" },
	{ label: "Pink", value: "#fca5a5" },
	{ label: "Green", value: "#94e2cd" },
	{ label: "Teal", value: "#2dd4bf" },
];

const Profile = () => {
	const dispatch = useAppDispatch();
	const user = useAppSelector((state) => state.user);

	const [fullname, setFullname] = useState<string>("");
	const [jobTitle, setJobTitle] = useState<string>("");
	const [color, setColor] = useState<string>("");
	const [profilePictureValue, setProfilePictureValue] = useState<string | null>(
		null,
	);
	const [profilePicturePreview, setProfilePicturePreview] = useState<
		string | null
	>(null);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const [updateUser, { isLoading }] = useUpdateUserMutation();

	useEffect(() => {
		if (!user.id) {
			return;
		}
		startTransition(() => {
			setFullname(user.fullname || "");
			setJobTitle(user.jobTitle || "");
			setColor(user.colorAvatar || "");
			setProfilePictureValue(user.profilePicture ?? null);
			setProfilePicturePreview(user.profilePicture ?? null);
		});
	}, [
		user.id,
		user.fullname,
		user.jobTitle,
		user.colorAvatar,
		user.profilePicture,
	]);

	const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) {
			return;
		}

		const reader = new FileReader();
		reader.onloadend = () => {
			const result = reader.result as string;
			setProfilePictureValue(result);
			setProfilePicturePreview(result);
		};
		reader.readAsDataURL(file);
		event.target.value = "";
	};

	const handleRemoveAvatar = () => {
		setProfilePictureValue(null);
		setProfilePicturePreview(null);
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!user.id) {
			toast.error("Không xác định được người dùng.");
			return;
		}

		const trimmedFullname = fullname.trim();
		const trimmedJobTitle = jobTitle.trim();
		const payload: {
			userId: string;
			fullname?: string;
			jobTitle?: string | null;
			colorAvatar?: string | null;
			profilePicture?: string | null;
		} = {
			userId: user.id,
		};
		let hasChanges = false;

		if (trimmedFullname && trimmedFullname !== user.fullname) {
			payload.fullname = trimmedFullname;
			hasChanges = true;
		}

		const normalizedJobTitle = trimmedJobTitle ? trimmedJobTitle : null;
		if (normalizedJobTitle !== (user.jobTitle ?? null)) {
			payload.jobTitle = normalizedJobTitle;
			hasChanges = true;
		}

		const normalizedColor = color || null;
		if (normalizedColor !== (user.colorAvatar ?? null)) {
			payload.colorAvatar = normalizedColor;
			hasChanges = true;
		}

		if ((profilePictureValue ?? null) !== (user.profilePicture ?? null)) {
			payload.profilePicture = profilePictureValue;
			hasChanges = true;
		}

		if (!hasChanges) {
			toast.info("Không có thay đổi nào để lưu.");
			return;
		}

		try {
			const response = await updateUser(payload).unwrap();
			dispatch(updateUserAction(response.user));
			setFullname(response.user.fullname || "");
			setJobTitle(response.user.jobTitle || "");
			setColor(response.user.colorAvatar || "");
			setProfilePictureValue(response.user.profilePicture ?? null);
			setProfilePicturePreview(response.user.profilePicture ?? null);
			toast.success("Cập nhật hồ sơ thành công.");
		} catch (error) {
			toast.error(extractErrorMessage(error, "Cập nhật hồ sơ thất bại."));
		}
	};

	const initials = (fullname || user.fullname || "")
		.split(" ")
		.filter(Boolean)
		.map((value: string) => value[0]?.toUpperCase() ?? "")
		.join("");

	return (
		<>
			<div className="space-y-4 mx-auto 2xl:min-w-7xl">
				<div className="px-4 py-2">
					<h1 className="text-2xl font-semibold">My Settings</h1>
				</div>
				<Card>
					<CardContent>
						<div className="grid grid-cols-3 gap-2 border-b pb-8 pt-4">
							<div className="space-y-1.5 hidden md:block">
								<h2 className="font-medium">Profile</h2>
								<span className="text-sm text-muted-foreground italic">
									Your personal information
								</span>
							</div>
							<div className="md:col-span-2 col-span-3">
								<form className="space-y-4" onSubmit={handleSubmit}>
									<div className="space-y-2">
										<h2 className="font-medium text-sm">Avatar</h2>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Avatar className="h-24 w-24 cursor-pointer">
													<AvatarImage
														src={profilePicturePreview ?? undefined}
														alt={fullname || user.fullname || ""}
													/>
													<AvatarFallback
														className="text-white text-2xl"
														style={{
															backgroundColor: color || user.colorAvatar || "",
														}}
													>
														{initials}
													</AvatarFallback>
												</Avatar>
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
												<RadioGroup
													className="grid grid-cols-5 gap-1.5"
													value={color}
													onValueChange={(e) => setColor(e)}
												>
													{colorList.map((swatch) => (
														<Tooltip key={swatch.label}>
															<TooltipTrigger asChild>
																<div>
																	<RadioGroupItem
																		value={swatch.value}
																		id={swatch.label}
																		className="peer sr-only "
																	/>
																	<Label
																		htmlFor={swatch.label}
																		className=" flex w-6 h-6 items-center justify-center rounded-full border-2 border-muted bg-popover p-2 cursor-pointer  hover:ring-2 hover:ring-sidebar-ring peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-(--checked-color) peer-data-[state=checked]:hover:ring-(--checked-color)"
																		style={
																			{
																				backgroundColor: swatch.value,
																				"--checked-color": swatch.value,
																			} as CSSProperties
																		}
																	></Label>
																</div>
															</TooltipTrigger>
															<TooltipContent side="bottom">
																<p>{swatch.label}</p>
															</TooltipContent>
														</Tooltip>
													))}
												</RadioGroup>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													onClick={() => setIsModalOpen(true)}
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
									<div className="space-y-2">
										<Label htmlFor="fullname">Full name</Label>
										<Input
											id="fullname"
											type="text"
											value={fullname}
											onChange={(event) => setFullname(event.target.value)}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="jobTitle">Job title</Label>
										<Input
											id="jobTitle"
											type="text"
											value={jobTitle}
											onChange={(event) => setJobTitle(event.target.value)}
										/>
									</div>
									<div className="flex items-center justify-end">
										<Button
											type="submit"
											className="cursor-pointer"
											disabled={isLoading}
										>
											{isLoading ? "Saving..." : "Save Changes"}
										</Button>
									</div>
								</form>
							</div>
						</div>
						<div className="grid grid-cols-3 gap-2 pb-8 pt-4">
							<div className="space-y-1.5 hidden md:block">
								<h2 className="font-medium">Danger zone</h2>
								<span className="text-sm text-muted-foreground italic">
									Proceed with caution
								</span>
							</div>
							<div className="md:col-span-2 col-span-3 flex flex-col md:flex-row gap-4 items-center justify-between">
								<div className="text-muted-foreground max-w-lg">
									Log out all sessions including any session on mobile, iPad,
									and other browsers
								</div>
								<div className="flex flex-col items-end gap-2 w-full md:w-auto">
									<Button variant={"outline"} className="cursor-pointer w-full">
										Log out of all sessions
									</Button>
									<Button
										variant={"destructive"}
										className="cursor-pointer w-full"
									>
										Delete Account
									</Button>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
			<CustomModal
				open={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				size="w-64"
			>
				<div className="flex h-full flex-col gap-6 px-4 pb-4">
					<div className="space-y-6">
						<div className="relative border rounded-md overflow-hidden w-44 h-44 mt-10 self-center">
							{profilePicturePreview ? (
								<Image
									src={profilePicturePreview}
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
								htmlFor="profilePicture"
							>
								Upload profile picture
							</Label>
							<Input
								id="profilePicture"
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
								disabled={!profilePicturePreview}
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

export default Profile;
