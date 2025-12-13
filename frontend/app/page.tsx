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
	Linkedin,
	Facebook,
	Twitter,
	Youtube,
	X,
	SearchIcon,
} from "lucide-react";
import Image from "next/image";

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

	return (
		<div className="min-h-screen">
			{/* Banner */}
			{showBanner && (
				<div className="bg-primary text-white relative">
					<div className="container px-4 py-3 flex items-center justify-center gap-4 text-sm mx-auto">
						<span className="text-white/90">
							<span className="font-semibold">Catch up on what you missed</span>
							<span className="hidden sm:inline">
								{" "}
								- See what&apos;s new with AI-powered technology & other product
								updates
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
							onClick={() => setShowBanner(false)}
							className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
				</div>
			)}
			{/* Header */}
			<header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur shadow">
				<div className="container flex h-16 items-center justify-between px-4 lg:px-8 max-w-7xl mx-auto">
					<div className="flex items-center gap-x-8">
						<div className="flex items-center gap-2">
							<Image src="/logo_l.svg" alt="Logo" width={100} height={100} />
						</div>
					</div>
					<div className="flex items-center">
						<SearchIcon className="h-5 w-5 hover:text-primary cursor-pointer transition-colors mr-1" />
						<div className="border-l h-5 ml-4 mr-2"></div>

						<Link href="/login">
							<Button
								variant="ghost"
								size={"lg"}
								className="rounded-full cursor-pointer text-primary/90 hover:text-primary"
							>
								Sign in
							</Button>
						</Link>
					</div>
				</div>
			</header>
			{/* Features Section */}

			<section className="relative overflow-hidden">
				<div className="container px-4 pt-12 mx-auto">
					<div className="text-center max-w-4xl mx-auto mb-10 md:mb-14">
						<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
							The AI-powered Jira:
							<br />
							from{" "}
							<span className="relative inline-block">
								<span className="text-primary">teams</span>
								<svg
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
								</svg>
							</span>{" "}
							to dreams
						</h1>
						<Link href="/register">
							<Button
								size="lg"
								className="cursor-pointer px-8 py-6 text-base font-medium rounded-full"
							>
								Get started
							</Button>
						</Link>
					</div>
				</div>
			</section>

			<section className="container px-4 lg:px-8 py-16 mx-auto" id="features">
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
					{features.map((feature) => (
						<Card
							key={feature.title}
							className="border-2 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group cursor-pointer"
						>
							<CardHeader className="space-y-3">
								<div className="h-12 w-12 rounded-xl bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
									<feature.icon className="h-6 w-6 text-primary" />
								</div>
								<CardTitle className="text-lg">{feature.title}</CardTitle>
								<CardDescription className="text-sm leading-relaxed">
									{feature.description}
								</CardDescription>
							</CardHeader>
						</Card>
					))}
				</div>
			</section>

			<section className="bg-linear-to-br from-blue-500 via-blue-600 to-indigo-700 py-16 md:py-20">
				<div className="container px-4 lg:px-8 max-w-4xl mx-auto text-center">
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 text-balance leading-tight">
						Ready to transform your workflow?
					</h2>
					<p className="text-sm md:text-md font-medium text-blue-100 mb-8 text-balance">
						Join thousands of teams already using our platform to deliver better
						results.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
						<Link href="/sign-in">
							<Button
								size="lg"
								className="border-2 border-white h-12 px-8 text-base font-semibold cursor-pointer hover:bg-white/10 rounded-full"
							>
								Get started for free
							</Button>
						</Link>
					</div>
				</div>
			</section>

			<footer className="bg-background/95 backdrop-blur pt-6 pb-2 border-t">
				<div className="container px-8 mx-auto max-w-7xl">
					<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-4">
						{footerFeatures.map((section) => (
							<div key={section.title} className="flex flex-col gap-4">
								{section.title === "./logo.svg" ? (
									<Image
										src="/logo_l.svg"
										alt="Logo"
										width={100}
										height={100}
									/>
								) : (
									<h3 className="text-lg font-bold">{section.title}</h3>
								)}
								<div className="flex flex-col gap-2">
									{section.links.map((link) => (
										<Link
											key={link}
											href="#"
											className={`text-sm hover:opacity-75 transition-opacity cursor-pointer ${
												section.title === "./logo.svg" ? "font-semibold" : ""
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
								<Facebook className="h-5 w-5 cursor-pointer hover:opacity-75 transition-opacity" />
								<Linkedin className="h-5 w-5 cursor-pointer hover:opacity-75 transition-opacity" />
								<Twitter className="h-5 w-5 cursor-pointer hover:opacity-75 transition-opacity" />
								<Youtube className="h-5 w-5 cursor-pointer hover:opacity-75 transition-opacity" />
							</div>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
