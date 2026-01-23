"use client";

import { useState, Fragment } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
	Dialog,
	DialogPanel,
	Transition,
	TransitionChild,
} from "@headlessui/react";
import { Loader, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepItem {
	title: string;
	subtitle?: string;
	component: React.ReactNode;
	canNext?: boolean;
	beforeNext?: () => Promise<boolean>;
}

interface ModalStepProps {
	open: boolean;
	onClose: () => void;
	componentList: StepItem[];
	initialStep?: number;
	onFinish?: () => void;
	finishLoading?: boolean;
	size?: string;
}

export const ModalStep = ({
	open,
	onClose,
	componentList,
	initialStep = 0,
	onFinish,
	finishLoading = false,
	size,
}: ModalStepProps) => {
	const [currentStep, setCurrentStep] = useState(initialStep);
	const [loading, setLoading] = useState(false);

	const step = componentList[currentStep];
	const totalSteps = componentList.length;
	const isLastStep = currentStep === totalSteps - 1;

	const handleNext = async () => {
		if (step.beforeNext) {
			try {
				setLoading(true);
				const ok = await step.beforeNext();
				if (!ok) return;
			} finally {
				setLoading(false);
			}
		}
		setCurrentStep((s) => s + 1);
	};

	return (
		<Transition show={open} appear as={Fragment}>
			<Dialog as="div" className="relative z-999" onClose={onClose}>
				<div className="fixed inset-0 bg-black/10 bg-opacity-50" />

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<TransitionChild
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<DialogPanel
								className={`rounded-lg text-left align-middle ${size}`}
							>
								<div className="relative rounded-lg flex h-full w-full flex-col bg-white shadow-2xl">
									<div className="absolute right-4 top-4">
										<Button
											variant="ghost"
											onClick={onClose}
											size="icon"
										>
											<X className="h-6 w-6" />
										</Button>
									</div>
									<div className="overflow-y-auto py-4 px-6">
										{/* HEADER */}
										<div className="p-2 space-y-0.5">
											<h2 className="text-xl font-semibold">
												{step.title}
											</h2>
											{step.subtitle && (
												<p className="text-sm text-muted-foreground">
													{step.subtitle}
												</p>
											)}
										</div>
										{/* BODY */}
										<div className="flex-1 overflow-hidden px-6 py-4">
											<AnimatePresence mode="wait">
												<motion.div
													key={currentStep}
													initial={{
														opacity: 0,
														x: 40,
													}}
													animate={{
														opacity: 1,
														x: 0,
													}}
													exit={{
														opacity: 0,
														x: -40,
													}}
													transition={{
														duration: 0.25,
														ease: "easeOut",
													}}
													className="h-full"
												>
													{step.component}
												</motion.div>
											</AnimatePresence>
										</div>
										{/* FOOTER */}
										<div className="p-2 flex justify-between items-center">
											{currentStep > 0 ? (
												<Button
													variant="ghost"
													disabled={loading}
													onClick={() =>
														setCurrentStep(
															(s) => s - 1,
														)
													}
													className="cursor-pointer"
												>
													Back
												</Button>
											) : (
												<div />
											)}

											{!isLastStep ? (
												<Button
													onClick={handleNext}
													disabled={
														step.canNext ===
															false || loading
													}
													className="cursor-pointer"
												>
													{loading
														? "Checking..."
														: "Continue"}
												</Button>
											) : (
												<Button
													disabled={finishLoading}
													onClick={
														onFinish ?? onClose
													}
													className="cursor-pointer"
												>
													{finishLoading ? (
														<>
															<Loader className="size-4 animate-spin" />
															<span className="ml-2">
																Loading...
															</span>
														</>
													) : (
														"Finish"
													)}
												</Button>
											)}
										</div>
									</div>
								</div>
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};
