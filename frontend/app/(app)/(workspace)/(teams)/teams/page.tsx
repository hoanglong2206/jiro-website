"use client";

import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";

const TeamsPage = () => {
	return (
		<div className="flex flex-col h-full bg-background">
			<div className="max-w-md text-center mx-auto my-auto">
				<div className="mb-6 flex justify-center">
					<div className="relative">
						<div className="w-24 h-24 rounded-2xl flex items-center bg-sidebar-accent justify-center">
							<Users className="w-12 h-12" />
						</div>
						<div className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary text-accent rounded-full flex items-center justify-center">
							<Plus className="w-6 h-6" />
						</div>
					</div>
				</div>

				<h2 className="text-2xl font-semibold mb-3">
					Bring everyone together onto one team
				</h2>
				<p className="text-muted-foreground mb-8 font-medium">
					Don't go it alone—create a team to start connecting work
					across apps and celebrating your collective success.
				</p>
				<Button className="cursor-pointer">Create team</Button>
			</div>
		</div>
	);
};

export default TeamsPage;
