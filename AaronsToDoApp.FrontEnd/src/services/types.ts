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
