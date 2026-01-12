"use client";
import { useProtectRoute } from "@/hooks/useProtectRoute";

interface AuthLayoutProps {
	children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
	useProtectRoute();

	return (
		<main className="flex min-h-screen items-center justify-center bg-background">
			{children}
		</main>
	);
};

export default AuthLayout;
