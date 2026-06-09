export interface LoginDto {
    email: string;
    password: string;
}

export interface AccessTokenDto {
    accessToken: string;
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

export interface UserInfoDto {
    email: string;
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
    createdUTC: string;
    completedUTC: string | null;
    deadlineUTC: string | null;
    description: string | null;
}

export interface CreateTaskRequestDto {
    name: string;
    deadlineUTC: string | null;
    description: string | null;
}

export interface UpdateTaskRequestDto {
    name: string;
    completedUTC: string | null;
    deadlineUTC: string | null;
    description: string | null;
}
