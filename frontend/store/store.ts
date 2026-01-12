import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import { api } from "./api";

import authReducer from "./reducers/auth.reducer";
import userReducer from "./reducers/user.reducer";
import logoutReducer from "./reducers/logout.reducer";

const persistConfig = {
	key: "root",
	storage,
	blacklist: ["clientApi", "_persist"],
};

const rootReducer = combineReducers({
	[api.reducerPath]: api.reducer,
	auth: authReducer,
	user: userReducer,
	logout: logoutReducer,
});

type RootStateType = ReturnType<typeof rootReducer>;

type RootAction = Parameters<typeof rootReducer>[1];

const rootReducerWithReset = (
	state: RootStateType | undefined,
	action: RootAction,
): RootStateType => {
	if (action.type === "logout/logout") {
		storage.removeItem("persist:root");
		state = undefined;
	}

	return rootReducer(state, action);
};

const persistsReducer = persistReducer(persistConfig, rootReducerWithReset);

export const store = configureStore({
	reducer: persistsReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}).concat(api.middleware),
});

setupListeners(store.dispatch);

export const persister = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
