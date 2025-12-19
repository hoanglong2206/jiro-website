"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Demo = () => {
	const router = useRouter();
	return (
		<div>
			<Button
				onClick={() => {
					router.push("/profile/me");
				}}
			>
				Demo Page
			</Button>
		</div>
	);
};

export default Demo;
