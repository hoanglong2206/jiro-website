import React from "react";
import { Check, Flag, Loader } from "lucide-react";

type StatusType = "completed" | "in-progress" | "blocked";

type BadgeTone = "amber" | "blue" | "sage" | "violet";

interface InboxItem {
	id: string;
	status: StatusType;
	headline: string;
	callout?: string;
	description: string;
	listChange?: string;
	extraNote?: string;
	timestamp: string;
	badge?: {
		text: string;
		tone: BadgeTone;
	};
}

interface InboxSection {
	title: string;
	items: InboxItem[];
}

const sections: InboxSection[] = [
	{
		title: "Today",
		items: [
			{
				id: "today-1",
				status: "completed",
				headline: "[Finance][Budget] - Finalize supplier contracts",
				callout: "Ops: Confirm legal handoff",
				description: "Alicia Daniels changed the status: In Review → Approved",
				listChange:
					"Moved from Sprint 6 (Mar 02 - Mar 06) → Sprint 7 (Mar 09 - Mar 13)",
				timestamp: "5:15 PM",
				badge: { text: "AD", tone: "amber" },
			},
			{
				id: "today-2",
				status: "in-progress",
				headline: "Export outstanding invoices for finance review",
				description: "Noah Patel moved this item to Sprint 8",
				listChange: "Sprint 7 (Mar 09 - Mar 13) → Sprint 8 (Mar 16 - Mar 20)",
				timestamp: "3:28 PM",
				badge: { text: "NP", tone: "sage" },
			},
		],
	},
	{
		title: "Yesterday",
		items: [
			{
				id: "yesterday-1",
				status: "blocked",
				headline: "[Office Supplies] Reorder printer toner",
				description: "Jenna Wright flagged this for missing vendor approval",
				timestamp: "Jan 26",
				badge: { text: "JW", tone: "violet" },
			},
		],
	},
	{
		title: "The last 7 days",
		items: [
			{
				id: "week-1",
				status: "completed",
				headline: "[Clinic] Add consent forms to patient packet (2)",
				description: "Marcus Lee changed the status: Testing → Done",
				timestamp: "Jan 22",
				badge: { text: "ML", tone: "blue" },
			},
			{
				id: "week-2",
				status: "completed",
				headline: "[Reports][Revenue] Include margin breakdown columns",
				description:
					"Marcus Lee moved the list: Sprint 5 (Feb 19 - Feb 23) → Sprint 6 (Feb 26 - Mar 01)",
				timestamp: "Jan 20",
			},
		],
	},
	{
		title: "Earlier this month",
		items: [
			{
				id: "month-1",
				status: "completed",
				headline: "[Reports][Service metrics] Add filter by clinic",
				description: "Alex Shaw changed the status: Testing → Done",
				timestamp: "Jan 13",
			},
			{
				id: "month-2",
				status: "completed",
				headline: "[Inventory][Vaccines] Limit results to 7-day window",
				description: "Alex Shaw changed the status: Testing → Done",
				timestamp: "Jan 9",
			},
			{
				id: "month-3",
				status: "completed",
				headline: "[Sales][Wholesale] Add staff ID column to export",
				description: "Kimberly Dai assigned this task to you",
				extraNote: "Remember to sync with accounting before handoff",
				timestamp: "Jan 6",
			},
		],
	},
];

const badgeToneClasses: Record<BadgeTone, string> = {
	amber: "bg-amber-100 text-amber-700",
	blue: "bg-blue-100 text-blue-700",
	sage: "bg-emerald-100 text-emerald-700",
	violet: "bg-violet-100 text-violet-700",
};

const StatusIndicator = ({ status }: { status: StatusType }) => {
	const shared =
		"flex h-6 w-6 items-center justify-center rounded-full border-2";

	if (status === "completed") {
		return (
			<span className={`${shared} border-emerald-500/70 bg-emerald-50`}>
				<Check className="h-3.5 w-3.5 text-emerald-600" strokeWidth={3} />
			</span>
		);
	}

	if (status === "in-progress") {
		return (
			<span className={`${shared} border-sky-500/70 bg-white`}>
				<Loader className="h-3.5 w-3.5 text-sky-500" strokeWidth={2.5} />
			</span>
		);
	}

	return (
		<span className={`${shared} border-rose-500/70 bg-rose-50`}>
			<Flag className="h-3.5 w-3.5 text-rose-500" strokeWidth={2.5} />
		</span>
	);
};

const InboxPage = () => {
	return (
		<div className="space-y-10 px-4 pb-12 pt-6 sm:px-8">
			<div className="space-y-12">
				{sections.map((section) => (
					<section key={section.title} className="space-y-4">
						<h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
							{section.title}
						</h2>
						<div className="space-y-3">
							{section.items.map((item) => (
								<article
									key={item.id}
									className="flex gap-4 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-[0_1px_0_rgba(15,23,42,0.04)] transition-colors hover:bg-muted/60"
								>
									<div className="pt-0.5">
										<StatusIndicator status={item.status} />
									</div>
									<div className="flex-1 space-y-2">
										<div className="flex flex-wrap items-center gap-2">
											<p className="text-sm font-medium text-foreground sm:text-base">
												{item.headline}
											</p>
											{item.callout ? (
												<span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-600">
													{item.callout}
												</span>
											) : null}
										</div>
										<p className="text-sm text-muted-foreground">
											{item.description}
										</p>
										{item.listChange ? (
											<p className="text-xs text-muted-foreground">
												{item.listChange}
											</p>
										) : null}
										{item.extraNote ? (
											<p className="text-xs text-foreground/70">
												{item.extraNote}
											</p>
										) : null}
									</div>
									<div className="flex flex-col items-end gap-3 text-xs text-muted-foreground">
										{item.badge ? (
											<span
												className={`inline-flex h-7 w-7 items-center justify-center rounded-full border border-border/60 text-xs font-semibold ${badgeToneClasses[item.badge.tone]}`}
											>
												{item.badge.text}
											</span>
										) : null}
										<time className="font-medium">{item.timestamp}</time>
									</div>
								</article>
							))}
						</div>
					</section>
				))}
			</div>
		</div>
	);
};

export default InboxPage;
