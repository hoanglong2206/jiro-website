"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { persister, store } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";

interface StoreProviderProps {
	children: ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
	return (
		<Provider store={store}>
			<PersistGate persistor={persister}>{children}</PersistGate>
		</Provider>
	);
}
