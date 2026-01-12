"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { persister, store } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { useCheckAuthenticated } from "@/hooks/useCheckAuthenticated";

interface StoreProviderProps {
	children: ReactNode;
}

function ProtectedProvider({ children }: StoreProviderProps) {
	useCheckAuthenticated();

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
