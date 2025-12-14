"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
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
import Image from "next/image";
import { Icons } from "@/lib/icon";

export function RegisterForm() {
	const [showPassword, setShowPassword] = useState(false);

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
	}

	return (
		<Card className="w-full max-w-md">
			<CardHeader className="space-y-1 text-center">
				<div className="flex items-center justify-center">
					<Image src="/logo_l.svg" alt="Logo" width={100} height={100} />
				</div>
				<CardTitle className="text-2xl font-bold">Create an account</CardTitle>
			</CardHeader>
			<form onSubmit={onSubmit}>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Full Name</Label>
						<Input id="name" placeholder="John Doe" required />
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="name@example.com"
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<div className="relative">
							<Input
								id="password"
								type={showPassword ? "text" : "password"}
								placeholder="Create a password"
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
					<Button type="submit" className="w-full cursor-pointer">
						Create Account
					</Button>
					<p className="text-center text-sm text-muted-foreground">
						Already have an account?{" "}
						<Link href="/login" className="text-primary hover:underline">
							Sign in
						</Link>
					</p>
				</CardFooter>
			</form>
		</Card>
	);
}
