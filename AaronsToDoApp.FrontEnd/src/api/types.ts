export interface LoginDto {
    email: string;
    password: string;
}

export interface AuthTokensDto {
    accessToken: string;
    refreshToken: string;
}

export interface RefreshTokenDto {
    refreshToken: string;
}

export interface PasswordRequirementsDto {
    requiredLength: number;
    requiredUniqueChars: number;
    requireNonAlphanumeric: boolean;
    requireLowercase: boolean;
    requireUppercase: boolean;
    requireDigit: boolean;
}

export interface RegisterDto {
    email: string;
    password: string;
}

export interface PagedDto<T> {
    items: T[];
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface ToDoTaskDto {
    id: number;
    name: string;
    createdUTC: Date;
    completedUTC: Date | null;
    deadlineUTC: Date | null;
    description: string | null;
}

export interface CreateTaskRequestDto {
    name: string;
    deadlineUTC: Date | null;
    description: string | null;
}

export interface UpdateTaskRequestDto {
    name: string;
    completedUTC: Date | null;
    deadlineUTC: Date | null;
    description: string | null;
}
