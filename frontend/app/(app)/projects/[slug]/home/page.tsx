import React from "react";
import {
	AlertCircle,
	Bug,
	CalendarDays,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	Circle,
	Flag,
	Loader,
	Plus,
} from "lucide-react";

type ActivityStatus = "completed" | "pending" | "issue";

interface RecentActivity {
	id: string;
	status: ActivityStatus;
	title: string;
	location: string;
	meta: string;
}

interface WorkBucket {
	id: string;
	label: string;
	count: number;
	note: string;
}

type PriorityTone = "high" | "normal" | "low";

interface AssignedTask {
	id: string;
	name: string;
	priority: PriorityTone;
	deadline?: string;
	subtasks?: number;
}

interface AssignedGroup {
	key: string;
	label: string;
	icon: "done" | "bug" | "progress";
	tasks: AssignedTask[];
}

const recentActivities: RecentActivity[] = [
	{
		id: "rec-1",
		status: "pending",
		title: "[Supply][Packaging] What is the next shipment?",
		location: "Sprint 12 (Jan 26 - Feb 1)",
		meta: "Updated 2 hours ago",
	},
	{
		id: "rec-2",
		status: "completed",
		title: "[Report][Optical Frames] Add unit cost column",
		location: "Sprint 12 (Jan 26 - Feb 1)",
		meta: "Completed by Natalie Torres",
	},
	{
		id: "rec-3",
		status: "pending",
		title: "Sprint 11 (Jan 19 - Jan 25)",
		location: "Sprint Boards",
		meta: "Moved by Oliver Grant",
	},
	{
		id: "rec-4",
		status: "pending",
		title: "Release Sprint",
		location: "Release / Deployment",
		meta: "Scheduled for Feb 3",
	},
	{
		id: "rec-5",
		status: "pending",
		title: "Sprint 12 (Jan 26 - Feb 1)",
		location: "Sprint Boards",
		meta: "Capacity at 80%",
	},
	{
		id: "rec-6",
		status: "completed",
		title: "Export payment receipts",
		location: "Sprint 12 (Jan 26 - Feb 1)",
		meta: "Approved by Finance",
	},
];

const workBuckets: WorkBucket[] = [
	{
		id: "today",
		label: "Today",
		count: 0,
		note: "Tasks assigned for the current day.",
	},
	{
		id: "late",
		label: "Late",
		count: 0,
		note: "Nothing overdue. You're on track.",
	},
	{
		id: "following",
		label: "Following",
		count: 0,
		note: "No watchers set on other tasks.",
	},
	{
		id: "unplanned",
		label: "Unplanned",
		count: 3,
		note: "Items without schedule details.",
	},
];

const assignedGroups: AssignedGroup[] = [
	{
		key: "done",
		label: "Done",
		icon: "done",
		tasks: [
			{
				id: "task-1",
				name: "[Vaccination][Export] Add clinician ID column",
				priority: "high",
				deadline: "Mar 04",
				subtasks: 1,
			},
		],
	},
	{
		key: "bug",
		label: "Bug",
		icon: "bug",
		tasks: [
			{
				id: "task-2",
				name: "[Office][NYP] What is next?",
				priority: "normal",
				deadline: "Feb 28",
			},
		],
	},
	{
		key: "progress",
		label: "In Progress",
		icon: "progress",
		tasks: [
			{
				id: "task-3",
				name: "[Optical Frames] Add gross margin column",
				priority: "low",
				deadline: "Mar 10",
			},
		],
	},
];

const activityStatusClasses: Record<ActivityStatus, string> = {
	completed: "border-emerald-500 bg-emerald-50 text-emerald-600",
	pending: "border-slate-300 bg-white text-slate-500",
	issue: "border-rose-500 bg-rose-50 text-rose-500",
};

const priorityToneClasses: Record<PriorityTone, string> = {
	high: "text-sm font-medium text-amber-600",
	normal: "text-sm font-medium text-slate-600",
	low: "text-sm font-medium text-sky-600",
};

const AssignedIcon = ({ icon }: { icon: AssignedGroup["icon"] }) => {
	if (icon === "done") {
		return (
			<CheckCircle2 className="h-4 w-4 text-emerald-600" strokeWidth={2.5} />
		);
	}

	if (icon === "bug") {
		return <Bug className="h-4 w-4 text-rose-500" strokeWidth={2.3} />;
	}

	return <Loader className="h-4 w-4 text-sky-500" strokeWidth={2.3} />;
};

const statusIcon = (status: ActivityStatus) => {
	if (status === "completed") {
		return <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.8} />;
	}

	if (status === "issue") {
		return <AlertCircle className="h-3.5 w-3.5" strokeWidth={2.5} />;
	}

	return <Circle className="h-3.5 w-3.5" strokeWidth={2} />;
};

const Home = () => {
	return (
		<div className="space-y-10 px-4 pb-12 pt-6 sm:px-8">
			<header className="space-y-2">
				<h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
					Good evening, Jordan
				</h1>
				<p className="text-sm text-muted-foreground">
					Review the latest updates from across your workspace and keep the
					important items close by.
				</p>
			</header>

			<div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
				<section className="rounded-3xl border border-border/60 bg-card/90 p-6 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-semibold text-foreground">Recent</h2>
						<span className="text-xs font-medium text-muted-foreground">
							Synced just now
						</span>
					</div>
					<ul className="mt-5 space-y-3">
						{recentActivities.map((activity) => (
							<li
								key={activity.id}
								className="flex items-start gap-4 rounded-2xl border border-border/60 bg-white/80 p-4 transition-colors hover:bg-muted/60"
							>
								<span
									className={`flex h-8 w-8 items-center justify-center rounded-full border ${activityStatusClasses[activity.status]}`}
								>
									{statusIcon(activity.status)}
								</span>
								<div className="flex-1 space-y-1">
									<p className="text-sm font-medium text-foreground sm:text-base">
										{activity.title}
									</p>
									<p className="text-xs text-muted-foreground">
										{activity.location}
									</p>
									<p className="text-xs text-muted-foreground">
										{activity.meta}
									</p>
								</div>
							</li>
						))}
					</ul>
				</section>

				<section className="rounded-3xl border border-border/60 bg-card/90 p-6 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-lg font-semibold text-foreground">Diary</h2>
							<p className="text-xs text-muted-foreground">Jan 27, 2026</p>
						</div>
						<div className="flex items-center gap-2 text-muted-foreground">
							<button className="flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-white">
								<ChevronLeft className="h-4 w-4" />
							</button>
							<button className="flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-white">
								<ChevronRight className="h-4 w-4" />
							</button>
						</div>
					</div>
					<div className="mt-6 flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/40 py-16 text-center">
						<CalendarDays className="h-10 w-10 text-muted-foreground" />
						<h3 className="mt-3 text-base font-medium text-foreground">
							Connect your calendar
						</h3>
						<p className="mt-1 max-w-xs text-sm text-muted-foreground">
							Events from connected calendars will appear here so you never miss
							a deadline.
						</p>
						<button className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
							<Plus className="h-4 w-4" /> Add calendar integrations
						</button>
					</div>
				</section>
			</div>

			<div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
				<section className="rounded-3xl border border-border/60 bg-card/95 p-6 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
					<div className="flex flex-wrap items-center justify-between gap-4">
						<div>
							<h2 className="text-lg font-semibold text-foreground">My work</h2>
							<p className="text-xs text-muted-foreground">
								Monitor tasks assigned to you.
							</p>
						</div>
						<div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
							<span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
								To Do
							</span>
							<span className="rounded-full bg-muted px-3 py-1">Finished</span>
							<span className="rounded-full bg-muted px-3 py-1">Delegate</span>
						</div>
					</div>
					<div className="mt-6 space-y-4">
						{workBuckets.map((bucket) => (
							<div
								key={bucket.id}
								className="rounded-2xl border border-border/60 bg-white/80 p-4"
							>
								<div className="flex items-center justify-between">
									<h3 className="text-sm font-medium text-foreground sm:text-base">
										{bucket.label}
									</h3>
									<span className="text-sm font-semibold text-muted-foreground">
										{bucket.count}
									</span>
								</div>
								<p className="mt-2 text-xs text-muted-foreground">
									{bucket.note}
								</p>
							</div>
						))}
					</div>
				</section>

				<section className="rounded-3xl border border-border/60 bg-card/95 p-6 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
					<div className="flex flex-wrap items-center justify-between gap-3">
						<div>
							<h2 className="text-lg font-semibold text-foreground">
								Assigned to me
							</h2>
							<p className="text-xs text-muted-foreground">
								Band: Status • Sub-tasks
							</p>
						</div>
						<div className="flex items-center gap-2 text-xs text-muted-foreground">
							<button className="rounded-full border border-border/60 px-3 py-1">
								Filter
							</button>
							<button className="rounded-full border border-border/60 px-3 py-1">
								Farm
							</button>
							<button className="rounded-full border border-border/60 px-3 py-1">
								To research…
							</button>
						</div>
					</div>
					<div className="mt-6 space-y-4">
						{assignedGroups.map((group) => (
							<div
								key={group.key}
								className="rounded-2xl border border-border/60 bg-white/80"
							>
								<header className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
									<div className="flex items-center gap-2">
										<span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/80">
											<AssignedIcon icon={group.icon} />
										</span>
										<span className="text-sm font-semibold text-foreground">
											{group.label}
										</span>
									</div>
									<button className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
										<Plus className="h-3.5 w-3.5" /> Add Task
									</button>
								</header>
								<ul className="divide-y divide-border/60">
									{group.tasks.map((task) => (
										<li
											key={task.id}
											className="flex items-center justify-between gap-3 px-4 py-4"
										>
											<div className="space-y-1">
												<p className="text-sm font-medium text-foreground sm:text-base">
													{task.name}
												</p>
												<div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
													<span className="inline-flex items-center gap-1">
														<Flag className="h-3 w-3" />
														<span
															className={priorityToneClasses[task.priority]}
														>
															{task.priority === "high"
																? "High"
																: task.priority === "normal"
																	? "Normal"
																	: "Low"}
														</span>
													</span>
													{task.deadline ? (
														<span className="inline-flex items-center gap-1">
															<CalendarDays className="h-3 w-3" /> Due{" "}
															{task.deadline}
														</span>
													) : null}
													{typeof task.subtasks === "number" ? (
														<span className="inline-flex items-center gap-1">
															<Loader className="h-3 w-3" /> {task.subtasks}{" "}
															sub-task
														</span>
													) : null}
												</div>
											</div>
											<button className="h-7 rounded-full border border-border/60 px-3 text-xs font-medium text-muted-foreground">
												Personalize
											</button>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</section>
			</div>
		</div>
	);
};

export default Home;
