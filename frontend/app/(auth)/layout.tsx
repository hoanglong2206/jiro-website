"use client";
import { useCheckAuthenticated } from "@/hooks/useCheckAuthenticated";
interface AuthLayoutProps {
	children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
	useCheckAuthenticated();

	return (
		<main className="flex min-h-screen items-center justify-center bg-background">
			{children}
		</main>
	);
};

export default AuthLayout;
