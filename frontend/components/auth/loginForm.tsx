"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/lib/icon";
import Image from "next/image";
import { useLoginMutation } from "@/services/auth.service";
import { useAppDispatch } from "@/store/store";
import { addAuthUser } from "@/store/reducers/auth.reducer";
import { useRouter } from "next/navigation";
import { saveToSessionStorage } from "@/services/utils.service";
import { updateLogout } from "@/store/reducers/logout.reducer";
import { toast } from "sonner";

export function LoginForm() {
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [login, { isLoading }] = useLoginMutation();
	const dispatch = useAppDispatch();
	const router = useRouter();

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		try {
			const result = await login({ email, password }).unwrap();

			if (result.user) {
				dispatch(
					addAuthUser({
						authInfo: result.user,
					}),
				);
				dispatch(updateLogout(false));
				saveToSessionStorage(
					JSON.stringify(true),
					JSON.stringify(result.user.username),
					result.token ? JSON.stringify(result.token) : undefined,
				);
			}
			toast.success("Đăng nhập thành công");
			router.push("/for-you");
		} catch (error) {
			console.error("Login failed:", error);
			toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
		}
	}

	return (
		<Card className="w-full max-w-md mx-8">
			<CardHeader className="space-y-1 text-center">
				<Link href="/" className="flex items-center justify-center">
					<Image
						src="/logo_l.svg"
						alt="Logo"
						width={100}
						height={100}
						loading="eager"
					/>
				</Link>
				<CardTitle className="text-2xl font-bold">
					Sign in to your account
				</CardTitle>
			</CardHeader>
			<form onSubmit={onSubmit}>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="name@example.com"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							required
						/>
					</div>
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label htmlFor="password">Password</Label>
						</div>
						<div className="relative">
							<Input
								id="password"
								type={showPassword ? "text" : "password"}
								placeholder="Enter your password"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								required
							/>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="absolute right-0 top-0 h-full px-3 hover:bg-transparent cursor-pointer"
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? (
									<EyeOff className="h-4 w-4 text-muted-foreground" />
								) : (
									<Eye className="h-4 w-4 text-muted-foreground" />
								)}
								<span className="sr-only">Toggle password visibility</span>
							</Button>
						</div>
						<div className="flex justify-end mt-1">
							<Link href="#" className="text-sm text-primary hover:underline">
								Forgot password?
							</Link>
						</div>
					</div>
					<div className="relative my-4">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t"></span>
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-white px-2 text-primary-500 font-medium">
								Or continue with
							</span>
						</div>
					</div>

					<div className="flex items-center justify-center gap-x-3 mb-4">
						<Button
							variant="outline"
							className="flex-1 flex items-center justify-center gap-2 cursor-pointer"
						>
							<Icons.gitHub className="h-5 w-5" />
							GitHub
						</Button>
						<Button
							variant="outline"
							className="flex-1 flex items-center justify-center gap-2 cursor-pointer"
						>
							<Icons.google className="h-5 w-5" />
							Google
						</Button>
					</div>
				</CardContent>
				<CardFooter className="flex flex-col gap-4">
					<Button
						type="submit"
						className="w-full cursor-pointer"
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Signing in...
							</>
						) : (
							"Sign In"
						)}
					</Button>
					<p className="text-center text-sm text-muted-foreground">
						Don&apos;t have an account?{" "}
						<Link href="/register" className="text-primary hover:underline">
							Create account
						</Link>
					</p>
				</CardFooter>
			</form>
		</Card>
	);
}
