"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { CSSProperties } from "react";

export interface ColorOption {
	label: string;
	value: string;
}

interface ColorPickerProps {
	value?: string;
	onChange: (value: string) => void;
}

const colorList: ColorOption[] = [
	{ label: "Red", value: "#f87171" },
	{ label: "Orange", value: "#fdba74" },
	{ label: "Yellow", value: "#fce94f" },
	{ label: "Blue", value: "#7dd3fc" },
	{ label: "Gray", value: "#9ca3af" },
	{ label: "Purple", value: "#c084fc" },
	{ label: "Fuchsia", value: "#e879f9" },
	{ label: "Pink", value: "#fca5a5" },
	{ label: "Green", value: "#94e2cd" },
	{ label: "Teal", value: "#2dd4bf" },
	{ label: "Indigo", value: "#818cf8" },
	{ label: "Sky", value: "#38bdf8" },
	{ label: "Lime", value: "#a3e635" },
	{ label: "Amber", value: "#fbbf24" },
	{ label: "Rose", value: "#fb7185" },
];

export const ColorPicker = ({ value = "", onChange }: ColorPickerProps) => {
	return (
		<RadioGroup
			className="grid grid-cols-5 gap-1.5"
			value={value}
			onValueChange={onChange}
		>
			{colorList.map((color) => (
				<Tooltip key={color.value}>
					<TooltipTrigger asChild>
						<div>
							<RadioGroupItem
								value={color.value}
								id={color.value}
								className="peer sr-only"
							/>
							<Label
								htmlFor={color.value}
								className="flex w-6 h-6 items-center justify-center rounded-full
								border-2 border-muted cursor-pointer
								hover:ring-2 hover:ring-sidebar-ring
								peer-data-[state=checked]:ring-2
								peer-data-[state=checked]:ring-(--checked-color)"
								style={
									{
										backgroundColor: color.value,
										"--checked-color": color.value,
									} as CSSProperties
								}
							/>
						</div>
					</TooltipTrigger>
					<TooltipContent side="bottom">
						<p>{color.label}</p>
					</TooltipContent>
				</Tooltip>
			))}
		</RadioGroup>
	);
};
