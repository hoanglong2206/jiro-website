import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

type SerializedLikeError = { message?: unknown };

export const lowerCase = (str: string): string => {
	return str.toLowerCase();
};

export const firstLetterUppercase = (str: string): string => {
	const valueString = lowerCase(`${str}`);
	return `${valueString.charAt(0).toUpperCase()}${valueString
		.slice(1)
		.toLowerCase()}`;
};

export const replaceSpacesWithDash = (title: string): string => {
	const lowercaseTitle: string = lowerCase(`${title}`);
	return lowercaseTitle.replace(/\/| /g, "-"); // replace / and space with -
};

export const replaceDashWithSpaces = (title: string): string => {
	const lowercaseTitle: string = lowerCase(`${title}`);
	return lowercaseTitle.replace(/-|\/| /g, " "); // replace - / and space with -
};

export const replaceAmpersandWithSpace = (title: string): string => {
	return title.replace(/&/g, "");
};

export const replaceAmpersandAndDashWithSpace = (title: string): string => {
	const titleWithoutDash = replaceDashWithSpaces(title);
	return titleWithoutDash.replace(/&| /g, " ");
};

export const saveToLocalStorage = (key: string, data: string): void => {
	window.localStorage.setItem(key, data);
};

export const getDataFromLocalStorage = (key: string) => {
	const data = window.localStorage.getItem(key) as string;
	return JSON.parse(data);
};

export const deleteFromLocalStorage = (key: string): void => {
	window.localStorage.removeItem(key);
};

export const isFetchBaseQueryError = (
	error: unknown,
): error is FetchBaseQueryError & { data?: unknown } => {
	return (
		typeof error === "object" &&
		error !== null &&
		"status" in error &&
		"data" in error
	);
};

const isSerializedLikeError = (
	value: unknown,
): value is SerializedLikeError => {
	return typeof value === "object" && value !== null && "message" in value;
};

export const extractErrorMessage = (
	error: unknown,
	fallbackMessage: string,
): string => {
	if (isFetchBaseQueryError(error)) {
		const responseData = error.data;
		if (
			typeof responseData === "object" &&
			responseData !== null &&
			"message" in responseData &&
			typeof (responseData as SerializedLikeError).message === "string"
		) {
			return (responseData as SerializedLikeError).message as string;
		}
	}

	if (isSerializedLikeError(error) && typeof error.message === "string") {
		return error.message;
	}

	return fallbackMessage;
};

export const generateRandomNumber = (length: number): number => {
	return (
		Math.floor(Math.random() * (9 * Math.pow(10, length - 1))) +
		Math.pow(10, length - 1)
	);
};

export const bytesToSize = (bytes: number): string => {
	const sizes: string[] = ["Bytes", "KB", "MB", "GB", "TB"];
	if (bytes === 0) {
		return "n/a";
	}
	const i = parseInt(`${Math.floor(Math.log(bytes) / Math.log(1024))}`, 10);
	if (i === 0) {
		return `${bytes} ${sizes[i]}`;
	}
	return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
};

// Auth utilities

export const saveToSessionStorage = (
	data: string,
	username: string,
	token?: string,
): void => {
	window.sessionStorage.setItem("data", data);
	window.sessionStorage.setItem("username", username);
	if (token) {
		window.sessionStorage.setItem("token", token);
	}
};

export const getDataFromSessionStorage = (key: string) => {
	const data = window.sessionStorage.getItem(key);
	if (data === null) {
		return null;
	}
	try {
		return JSON.parse(data);
	} catch {
		return data;
	}
};

export const deleteFromSessionStorage = (): void => {
	window.sessionStorage.removeItem("data");
	window.sessionStorage.removeItem("username");
	window.sessionStorage.removeItem("token");
};
