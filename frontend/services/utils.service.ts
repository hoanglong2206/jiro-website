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

export const isFetchBaseQueryError = (error: unknown): boolean => {
	return (
		typeof error === "object" &&
		error !== null &&
		"status" in error &&
		"data" in error
	);
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

export const saveToSessionStorage = (token: string, username: string): void => {
	window.sessionStorage.setItem("token", token);
	window.sessionStorage.setItem("username", username);
};

export const getDataFromSessionStorage = (key: string) => {
	const data = window.sessionStorage.getItem(key);
	return data;
};

export const deleteFromSessionStorage = (): void => {
	window.sessionStorage.removeItem("token");
	window.sessionStorage.removeItem("username");
};
