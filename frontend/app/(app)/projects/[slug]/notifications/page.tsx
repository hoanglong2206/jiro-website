"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Bell, BellDot, Search } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { NotificationResponse } from "@/types/notification.interface";

const notifications: NotificationResponse[] = [
	{
		id: "notif-001",
		userId: "user-123",
		type: "friend_request",
		title: "Lời mời kết bạn mới",
		message: "Nguyễn Văn A đã gửi cho bạn một lời mời kết bạn.",
		referenceId: "req-999",
		referenceType: "friend_request",
		isRead: false,
		createdAt: new Date("2024-03-20T10:00:00Z"),
		readAt: null,
	},
	{
		id: "notif-002",
		userId: "user-123",
		type: "comment",
		title: "Bình luận mới",
		message: "Trần Thị B đã bình luận về bài viết của bạn.",
		referenceId: "post-456",
		referenceType: "post",
		isRead: true,
		createdAt: new Date("2024-03-19T15:30:00Z"),
		readAt: new Date("2024-03-19T16:00:00Z"),
	},
	{
		id: "notif-003",
		userId: "user-123",
		type: "mention",
		title: "Bạn được nhắc tên",
		message: "Lê Văn C đã nhắc đến bạn trong một bình luận.",
		referenceId: "comment-789",
		referenceType: "comment",
		isRead: false,
		createdAt: new Date("2024-03-20T08:15:00Z"),
		readAt: null,
	},
	{
		id: "notif-004",
		userId: "user-123",
		type: "friend_accepted",
		title: "Chấp nhận kết bạn",
		message: "Phạm Minh D đã chấp nhận lời mời kết bạn của bạn.",
		referenceId: "user-888",
		referenceType: "user",
		isRead: false,
		createdAt: new Date("2024-03-20T11:45:00Z"),
		readAt: null,
	},
	{
		id: "notif-005",
		userId: "user-123",
		type: "system",
		title: "Cập nhật hệ thống",
		message: "Hệ thống sẽ bảo trì vào lúc 2 giờ sáng ngày mai.",
		referenceId: null,
		referenceType: null,
		isRead: false,
		createdAt: new Date("2024-03-20T12:00:00Z"),
		readAt: null,
	},
	{
		id: "notif-006",
		userId: "user-123",
		type: "comment",
		title: "Phản hồi bình luận",
		message: "Hoàng E đã trả lời bình luận của bạn.",
		referenceId: "post-111",
		referenceType: "post",
		isRead: true,
		createdAt: new Date("2024-03-18T09:20:00Z"),
		readAt: new Date("2024-03-18T10:05:00Z"),
	},
	{
		id: "notif-007",
		userId: "user-123",
		type: "friend_request",
		title: "Lời mời kết bạn",
		message: "Vũ F muốn kết nối với bạn.",
		referenceId: "req-101",
		referenceType: "friend_request",
		isRead: false,
		createdAt: new Date("2024-03-20T14:20:00Z"),
		readAt: null,
	},
	{
		id: "notif-008",
		userId: "user-123",
		type: "mention",
		title: "Nhắc tên trong bài viết",
		message: "Đặng G đã nhắc tên bạn trong một bài viết mới.",
		referenceId: "post-222",
		referenceType: "post",
		isRead: true,
		createdAt: new Date("2024-03-17T20:00:00Z"),
		readAt: new Date("2024-03-17T21:30:00Z"),
	},
	{
		id: "notif-009",
		userId: "user-123",
		type: "system",
		title: "Bảo mật tài khoản",
		message: "Có một thiết bị mới vừa đăng nhập vào tài khoản của bạn.",
		referenceId: null,
		referenceType: null,
		isRead: false,
		createdAt: new Date("2024-03-20T16:10:00Z"),
		readAt: null,
	},
	{
		id: "notif-010",
		userId: "user-123",
		type: "friend_accepted",
		title: "Bạn mới",
		message: "Bùi H đã trở thành bạn bè với bạn.",
		referenceId: "user-333",
		referenceType: "user",
		isRead: true,
		createdAt: new Date("2024-03-16T11:00:00Z"),
		readAt: new Date("2024-03-16T11:10:00Z"),
	},
];

export default function Notifications() {
	const [typeNotification, setTypeNotification] = useState<"all" | "unread">(
		"all"
	);
	const [filter, setFilter] = useState<string[]>([
		"friend",
		"comment",
		"system",
		"mention",
	]);
	const [search, setSearch] = useState<string>("");

	const filteredNotifications = notifications.filter((n) => {
		if (typeNotification === "unread" && n.isRead) return false;

		const isFriendType =
			n.type === "friend_request" || n.type === "friend_accepted";
		const matchedFilter = filter.some((f) => {
			if (f === "friend") return isFriendType;
			return f === n.type;
		});
		if (!matchedFilter) return false;

		if (
			search &&
			!`${n.title} ${n.message} ${n.type} ${n.referenceId || ""}`
				.toLowerCase()
				.includes(search.toLowerCase())
		) {
			return false;
		}

		return true;
	});

	return (
		<div className="h-full flex flex-col">
			<header className="bg-accent/50 border-b border-sidebar-foreground/2 px-4 py-3 flex items-center justify-between">
				<h1 className="text-xl font-semibold">Notifications</h1>
			</header>

			{/* Main Content */}
			<div className="flex flex-1 overflow-hidden">
				{/* Sidebar */}
				<aside className="w-64 bg-accent/50 text-sidebar-foreground border-r border-sidebar-foreground/2">
					<nav className="mt-2 px-3 space-y-1">
						<div
							onClick={() => setTypeNotification("all")}
							className={cn(
								"flex items-center px-4 py-2 rounded-md text-sm hover:bg-sidebar-accent cursor-pointer transition-colors",
								typeNotification === "all" &&
									"bg-sidebar-primary/20 hover:bg-sidebar-primary/40 text-primary"
							)}
						>
							<Bell className="w-4 h-4 mr-3" />
							All
						</div>

						<div
							onClick={() => setTypeNotification("unread")}
							className={cn(
								"flex items-center px-4 py-2 rounded-md text-sm hover:bg-sidebar-accent cursor-pointer transition-colors",
								typeNotification === "unread" &&
									"bg-sidebar-primary/20 hover:bg-sidebar-primary/40 text-primary"
							)}
						>
							<BellDot className="w-4 h-4 mr-3" />
							Unread
						</div>
					</nav>
				</aside>

				{/* Main Area */}
				<main className="flex-1 flex flex-col items-center py-6 px-8">
					<div className="flex flex-col lg:flex-row items-center justify-between w-full">
						<div className="relative w-full max-w-xl">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search"
								className="h-9 pl-9 focus-visible:ring-primary"
							/>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline">Filter</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuCheckboxItem
									key="all"
									checked={filter.length === 4}
									onCheckedChange={(checked) => {
										if (checked) {
											setFilter([
												"friend",
												"comment",
												"system",
												"mention",
											]);
										} else {
											setFilter([]);
										}
									}}
								>
									All
								</DropdownMenuCheckboxItem>
								{["Friend", "Comment", "System", "Mention"].map(
									(item) => {
										return (
											<DropdownMenuCheckboxItem
												key={item}
												checked={filter.includes(
													item.toLowerCase()
												)}
												onCheckedChange={(checked) => {
													const value =
														item.toLowerCase();
													setFilter((prev) =>
														checked
															? [...prev, value]
															: prev.filter(
																	(f) =>
																		f !==
																		value
															  )
													);
												}}
											>
												{item}
											</DropdownMenuCheckboxItem>
										);
									}
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<div className="w-full mt-6 space-y-3 flex-1 overflow-y-auto">
						{filteredNotifications.length === 0 && (
							<p className="text-muted-foreground text-sm">
								No notifications found
							</p>
						)}

						{filteredNotifications.map((n) => (
							<NotificationCard key={n.id} notification={n} />
						))}
					</div>
				</main>
			</div>
		</div>
	);
}

export const NotificationCard = ({
	notification,
}: {
	notification: NotificationResponse;
}) => {
	return (
		<div
			className={cn(
				"w-full rounded-md border p-4",
				!notification.isRead && "bg-primary/5"
			)}
		>
			<h3 className="font-medium">{notification.title}</h3>
			<p className="text-sm text-muted-foreground">
				{notification.message}
			</p>
		</div>
	);
};
