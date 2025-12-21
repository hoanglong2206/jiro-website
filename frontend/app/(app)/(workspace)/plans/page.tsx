"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Plan = Record<string, unknown>;

export default function PlansPage() {
	const [plans] = useState<Plan[]>([]);

	return (
		<div className="flex-1 overflow-auto bg-background">
			<div className="p-8">
				<h1 className="text-2xl font-bold mb-8">Plans</h1>

				{plans.length === 0 && (
					<div className="flex flex-col items-center justify-center py-20">
						<div className="mb-8">
							<svg
								width="200"
								height="160"
								viewBox="0 0 200 160"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<rect
									x="40"
									y="20"
									width="120"
									height="90"
									rx="4"
									fill="#1e3a5f"
								/>
								<rect
									x="45"
									y="25"
									width="110"
									height="80"
									rx="2"
									fill="#0d2137"
								/>
								<rect
									x="55"
									y="70"
									width="15"
									height="30"
									rx="2"
									fill="#2563eb"
								/>
								<rect
									x="75"
									y="55"
									width="15"
									height="45"
									rx="2"
									fill="#3b82f6"
								/>
								<rect
									x="95"
									y="40"
									width="15"
									height="60"
									rx="2"
									fill="#60a5fa"
								/>
								<rect
									x="115"
									y="50"
									width="15"
									height="50"
									rx="2"
									fill="#93c5fd"
								/>
								<circle cx="145" cy="35" r="12" fill="#22c55e" />
								<path
									d="M140 35 L143 38 L150 31"
									stroke="white"
									strokeWidth="2"
									fill="none"
								/>
								<circle cx="165" cy="55" r="8" fill="#06b6d4" />
								<circle cx="70" cy="125" r="12" fill="#f97316" />
								<rect
									x="60"
									y="138"
									width="20"
									height="20"
									rx="4"
									fill="#f97316"
								/>
								<circle cx="70" cy="122" r="5" fill="#fed7aa" />
								<circle cx="130" cy="130" r="10" fill="#fbbf24" />
								<rect
									x="122"
									y="141"
									width="16"
									height="17"
									rx="3"
									fill="#fbbf24"
								/>
								<circle cx="130" cy="127" r="4" fill="#fde68a" />
								<rect
									x="82"
									y="145"
									width="30"
									height="4"
									rx="2"
									fill="#fed7aa"
								/>
								<rect
									x="50"
									y="85"
									width="30"
									height="20"
									rx="2"
									fill="#1e40af"
									opacity="0.5"
								/>
								<rect
									x="85"
									y="85"
									width="20"
									height="20"
									rx="2"
									fill="#22c55e"
									opacity="0.5"
								/>
							</svg>
						</div>
						<h2 className="text-xl font-semibold mb-2">No plans yet</h2>
						<Button
							variant="outline"
							className="border-primary text-primary hover:bg-primary/10 bg-transparent"
						>
							Create plan
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
