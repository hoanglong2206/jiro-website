"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { persistor, store } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";

interface StoreProviderProps {
	children: ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
	return (
		<Provider store={store}>
			<PersistGate persistor={persistor}>{children}</PersistGate>
		</Provider>
	);
}
