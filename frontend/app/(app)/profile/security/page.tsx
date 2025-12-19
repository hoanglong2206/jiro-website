"use client";

import { FormEvent, useState } from "react";
import { Eye, EyeOff, Shield, Smartphone, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useChangePasswordMutation } from "@/services/auth.service";
import { saveToSessionStorage } from "@/services/utils.service";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { addAuthUser } from "@/store/reducers/auth.reducer";

export default function SecurityPage() {
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
	const [statusMessage, setStatusMessage] = useState<string | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const dispatch = useAppDispatch();
	const authUser = useAppSelector((state) => state.auth);
	const [changePassword, { isLoading }] = useChangePasswordMutation();

	const [passwords, setPasswords] = useState({
		current: "",
		new: "",
		confirm: "",
	});

	const handleUpdatePassword = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setStatusMessage(null);
		setErrorMessage(null);

		if (!passwords.current || !passwords.new || !passwords.confirm) {
			setErrorMessage("All fields are required");
			return;
		}

		if (passwords.new !== passwords.confirm) {
			setErrorMessage("Passwords do not match");
			return;
		}

		try {
			const result = await changePassword({
				currentPassword: passwords.current,
				newPassword: passwords.new,
				confirmPassword: passwords.confirm,
			}).unwrap();

			if (result.user) {
				dispatch(
					addAuthUser({
						authInfo: result.user,
					}),
				);
			}

			if (result.token) {
				const usernameSource = result.user?.username ?? authUser.username;
				saveToSessionStorage(
					JSON.stringify(true),
					JSON.stringify(usernameSource ?? ""),
					JSON.stringify(result.token),
				);
			}

			setStatusMessage("Password updated successfully.");
			setPasswords({ current: "", new: "", confirm: "" });
		} catch (error) {
			let message = "Failed to update password.";
			if (
				error &&
				typeof error === "object" &&
				"data" in error &&
				typeof (error as { data?: unknown }).data === "object" &&
				(error as { data?: { message?: unknown } }).data?.message
			) {
				const maybeMessage = (error as { data?: { message?: unknown } }).data
					?.message;
				if (typeof maybeMessage === "string") {
					message = maybeMessage;
				}
			}
			setErrorMessage(message);
		}
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<div className="flex items-center gap-2">
						<KeyRound className="h-5 w-5 text-muted-foreground" />
						<div>
							<CardTitle>Change Password</CardTitle>
							<CardDescription>
								Update your password to keep your account secure
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<form className="space-y-4" onSubmit={handleUpdatePassword}>
						<div className="space-y-2">
							<Label htmlFor="currentPassword">Current Password</Label>
							<div className="relative">
								<Input
									id="currentPassword"
									type={showCurrentPassword ? "text" : "password"}
									value={passwords.current}
									onChange={(e) =>
										setPasswords({ ...passwords, current: e.target.value })
									}
									placeholder="Enter current password"
								/>
								<button
									type="button"
									onClick={() => setShowCurrentPassword(!showCurrentPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
								>
									{showCurrentPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</button>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="newPassword">New Password</Label>
							<div className="relative">
								<Input
									id="newPassword"
									type={showNewPassword ? "text" : "password"}
									value={passwords.new}
									onChange={(e) =>
										setPasswords({ ...passwords, new: e.target.value })
									}
									placeholder="Enter new password"
								/>
								<button
									type="button"
									onClick={() => setShowNewPassword(!showNewPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
								>
									{showNewPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</button>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirmPassword">Confirm New Password</Label>
							<div className="relative">
								<Input
									id="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									value={passwords.confirm}
									onChange={(e) =>
										setPasswords({ ...passwords, confirm: e.target.value })
									}
									placeholder="Confirm new password"
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
								>
									{showConfirmPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</button>
							</div>
						</div>

						{statusMessage && (
							<p className="text-sm text-emerald-600">{statusMessage}</p>
						)}
						{errorMessage && (
							<p className="text-sm text-destructive">{errorMessage}</p>
						)}
						<Button className="mt-2" type="submit" disabled={isLoading}>
							{isLoading ? "Updating..." : "Update Password"}
						</Button>
					</form>
				</CardContent>
			</Card>

			{/* Two-Factor Authentication */}
			<Card>
				<CardHeader>
					<div className="flex items-center gap-2">
						<Shield className="h-5 w-5 text-muted-foreground" />
						<div>
							<CardTitle>Two-Factor Authentication</CardTitle>
							<CardDescription>
								Add an extra layer of security to your account
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Smartphone className="h-8 w-8 text-muted-foreground" />
							<div>
								<p className="text-sm font-medium">Authenticator App</p>
								<p className="text-xs text-muted-foreground">
									Use an authenticator app to generate verification codes
								</p>
							</div>
						</div>
						<Switch
							checked={twoFactorEnabled}
							onCheckedChange={setTwoFactorEnabled}
						/>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
