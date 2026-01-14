"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	LayoutDashboard,
	KanbanSquare,
	CheckSquare,
	BarChart3,
	Users,
	Zap,
	ArrowRight,
	X,
	SearchIcon,
} from "lucide-react";
import Image from "next/image";
import { Icons } from "@/lib/icon";
import { motion, AnimatePresence } from "framer-motion";

const fadeInUp = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.5 },
};

const staggerContainer = {
	animate: {
		transition: {
			staggerChildren: 0.1,
		},
	},
};

export default function Home() {
	const [showBanner, setShowBanner] = useState<boolean>(true);

	const features: {
		title: string;
		description: string;
		icon: React.ComponentType<{ className?: string }>;
	}[] = [
		{
			title: "Kanban Boards",
			description:
				"Visualize workflows with intuitive drag-and-drop boards that keep everyone aligned",
			icon: KanbanSquare,
		},
		{
			title: "Task Management",
			description:
				"Create, assign, and track tasks with detailed descriptions, comments, and custom fields",
			icon: CheckSquare,
		},
		{
			title: "Analytics & Reports",
			description:
				"Real-time insights into team performance with customizable dashboards and reports",
			icon: BarChart3,
		},
		{
			title: "Team Collaboration",
			description:
				"Work together seamlessly with @mentions, comments, and real-time notifications",
			icon: Users,
		},
		{
			title: "Custom Dashboards",
			description:
				"Build personalized views to track the metrics that matter most to your team",
			icon: LayoutDashboard,
		},
		{
			title: "Automations",
			description:
				"Automate repetitive workflows to save time and eliminate manual errors",
			icon: Zap,
		},
	];

	const footerFeatures: { title: string; links: string[] }[] = [
		{
			title: "./logo.svg",
			links: ["Company", "Careers", "Blogs", "Contact us"],
		},
		{
			title: "Product",
			links: ["Jira", "Trello", "Confluence", "Bitbucket"],
		},
		{
			title: "Resources",
			links: [
				"Purchasing & Licensing",
				"Technical Support",
				"Community",
				"Marketplace",
			],
		},
		{
			title: "Learn",
			links: ["Partners", "Documentation", "Training", "Enterprise"],
		},
	];

	const handleCloseBanner = () => {
		setShowBanner(false);

		setTimeout(() => {
			setShowBanner(true);
		}, 60000);
	};

	return (
		<div className="min-h-screen overflow-x-hidden">
			<AnimatePresence>
				{showBanner && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="bg-primary text-white relative overflow-hidden"
					>
						<div className="container px-4 py-3 flex items-center justify-center gap-4 text-sm mx-auto">
							<span className="text-white/90">
								<span className="font-semibold">
									Catch up on what you missed
								</span>
								<span className="hidden sm:inline">
									{" "}
									- See what&apos;s new with AI-powered
									technology
								</span>
							</span>
							<Link
								href="#"
								className="font-medium inline-flex items-center gap-1 whitespace-nowrap group hover:text-white/80 transition-colors"
							>
								Watch on demand{" "}
								<ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
							</Link>
							<Button
								onClick={handleCloseBanner}
								className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
							>
								<X className="h-4 w-4" />
							</Button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Header */}
			<header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur shadow-sm">
				<div className="container flex h-16 items-center justify-between px-4 lg:px-8 max-w-7xl mx-auto">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						className="flex items-center gap-2"
					>
						<Image
							src="/logo_l.svg"
							alt="Logo"
							width={100}
							height={100}
							priority
						/>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						className="flex items-center gap-4"
					>
						<SearchIcon className="h-5 w-5 hover:text-primary cursor-pointer transition-colors" />
						<div className="border-l h-5"></div>
						<Link href="/login">
							<Button
								variant="ghost"
								size={"lg"}
								className="rounded-full cursor-pointer text-primary/90 hover:text-primary"
							>
								Sign in
							</Button>
						</Link>
					</motion.div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="relative pt-20 pb-16 overflow-hidden">
				<div className="container px-4 mx-auto text-center">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, ease: "easeOut" }}
					>
						<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
							The AI-powered Jira <br />
							from{" "}
							<span className="relative inline-block text-primary">
								teams
								<motion.svg
									initial={{ pathLength: 0 }}
									animate={{ pathLength: 1 }}
									transition={{ duration: 1, delay: 0.5 }}
									className="absolute -bottom-2 left-0 w-full"
									viewBox="0 0 200 12"
									fill="none"
								>
									<path
										d="M2 8C50 2 150 2 198 8"
										stroke="#FFC400"
										strokeWidth="4"
										strokeLinecap="round"
									/>
								</motion.svg>
							</span>{" "}
							to dreams
						</h1>

						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<Link href="/register">
								<Button
									size="lg"
									className="cursor-pointer px-8 py-6 text-base font-medium rounded-full"
								>
									Get started
								</Button>
							</Link>
						</motion.div>
					</motion.div>
				</div>
			</section>

			{/* Features Section */}
			<section
				className="container px-4 lg:px-8 py-16 mx-auto"
				id="features"
			>
				<motion.div
					variants={staggerContainer}
					initial="initial"
					whileInView="animate"
					viewport={{ once: true, margin: "-100px" }}
					className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
				>
					{features.map((feature, index) => (
						<motion.div key={index} variants={fadeInUp}>
							<Card className="border-2 hover:border-primary/50 hover:shadow-xl transition-all duration-300 group h-full cursor-pointer">
								<CardHeader className="space-y-3">
									<div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
										<feature.icon className="h-6 w-6 text-primary group-hover:text-white" />
									</div>
									<CardTitle className="text-lg">
										{feature.title}
									</CardTitle>
									<CardDescription>
										{feature.description}
									</CardDescription>
								</CardHeader>
							</Card>
						</motion.div>
					))}
				</motion.div>
			</section>

			{/* CTA Section */}
			<motion.section
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				viewport={{ once: true }}
				className="bg-linear-to-br from-blue-600 to-indigo-800 py-20 text-white"
			>
				<div className="container px-4 text-center max-w-4xl mx-auto">
					<motion.h2
						initial={{ y: 20, opacity: 0 }}
						whileInView={{ y: 0, opacity: 1 }}
						className="text-3xl md:text-5xl font-bold mb-6"
					>
						Ready to transform your workflow?
					</motion.h2>
					<p className="text-sm md:text-md font-medium text-blue-100 mb-8 text-balance">
						Join thousands of teams already using our platform to
						deliver better results.
					</p>
					<Button
						size="lg"
						className="border-2 border-white h-12 px-8 text-base font-semibold cursor-pointer hover:bg-white/10 rounded-full"
					>
						Get started for free
					</Button>
				</div>
			</motion.section>

			{/* Footer - Giữ nguyên logic nhưng thêm hiệu ứng nhẹ */}
			<footer className="bg-background border-t pt-12 pb-6">
				<div className="container px-8 mx-auto max-w-7xl">
					<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-4">
						{footerFeatures.map((section) => (
							<div
								key={section.title}
								className="flex flex-col gap-4"
							>
								{section.title === "./logo.svg" ? (
									<Image
										src="/logo_l.svg"
										alt="Logo"
										width={100}
										height={100}
									/>
								) : (
									<h3 className="text-lg font-bold">
										{section.title}
									</h3>
								)}
								<div className="flex flex-col gap-2">
									{section.links.map((link) => (
										<Link
											key={link}
											href="#"
											className={`text-sm hover:opacity-75 transition-opacity cursor-pointer ${
												section.title === "./logo.svg"
													? "font-semibold"
													: ""
											}`}
										>
											{link}
										</Link>
									))}
								</div>
							</div>
						))}
					</div>
					<div className="flex w-full flex-col gap-y-4 items-center justify-center border-t border-gray-200 py-4 md:flex-row md:justify-between ">
						<p> &copy; 2024 Demo App, Inc. All rights reserved. </p>
						<div className="flex gap-4 sm:justify-center">
							<div className="flex items-center justify-between gap-x-5 ">
								<Icons.facebook className="h-5 w-5 cursor-pointer hover:opacity-75 transition-opacity" />
								<Icons.linkedin className="h-5 w-5 cursor-pointer hover:opacity-75 transition-opacity" />
								<Icons.twitter className="h-5 w-5 cursor-pointer hover:opacity-75 transition-opacity" />
								<Icons.youtube className="h-5 w-5 cursor-pointer hover:opacity-75 transition-opacity" />
							</div>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
