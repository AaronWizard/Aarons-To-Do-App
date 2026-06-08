import { isAxiosError } from "axios";

export class ApiError extends Error {
    networkError?: boolean;
    status?: number;

    constructor(message: string, networkError?: boolean, status?: number) {
        super(message);
        this.name = 'ApiError';
        this.networkError = networkError;
        this.status = status;

        // Required when extending built-in classes in TypeScript
        Object.setPrototypeOf(this, ApiError.prototype);
    }

    isClientError(): boolean {
        if (this.status) {
            return (this.status >= 400) && (this.status < 500);
        }
        else {
            return false;
        }
    }
}

const handleApiError = (error: unknown): never => {
    if (!isAxiosError(error)) {
        throw new ApiError('An unexpected application error occurred.');
    }

    if (!error.response) {
        // Network error
        throw new ApiError('A network error occurred.', true);
    }

    const status = error.response.status;
    const data = error.response.data;
    let message = 'An unexpected error occurred.';

    if (status >= 500) {
        message = 'A server error occurred. Please try again later.';
    } else if ((status >= 400) && (status < 500)) {
        if (Array.isArray(data)) {
            message = data.join(', ');
        } else {
            message = 'The request failed.';
        }
    }

    throw new ApiError(message, false, status);
};

export const rejectAPIError = (error: unknown) =>
    Promise.reject(handleApiError(error));
