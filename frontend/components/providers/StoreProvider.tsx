"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { persister, store } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { useProtectRoute } from "@/hooks/useProtectRoute";

interface StoreProviderProps {
	children: ReactNode;
}

function ProtectedProvider({ children }: StoreProviderProps) {
	useProtectRoute();

	return children;
}

export function StoreProvider({ children }: StoreProviderProps) {
	return (
		<Provider store={store}>
			<PersistGate persistor={persister}>
				<ProtectedProvider>{children}</ProtectedProvider>
			</PersistGate>
		</Provider>
	);
}
