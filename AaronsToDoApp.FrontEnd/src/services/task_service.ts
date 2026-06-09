import { apiClient } from "../api/api";
import type {
    CreateTaskRequestDto,
    PagedDto,
    ToDoTaskDto,
    UpdateTaskRequestDto
} from "../api/types";

const METHOD_GET = 'todotasks';
const METHOD_CREATE = METHOD_GET;
const METHOD_UPDATE = METHOD_GET;
const METHOD_DELETE = METHOD_GET;

class TasksService {
    async getPaginatedTasks(
        page: number,
        pageSize: number,
        signal: AbortSignal
    ): Promise<PagedDto<ToDoTaskDto>> {
        const response = await apiClient.get<PagedDto<ToDoTaskDto>>(
            METHOD_GET,
            {
                signal,
                params: {
                    page: page,
                    pageSize: pageSize
                }
            }
        );
        return response.data;
    }

    async createTask(data: CreateTaskRequestDto): Promise<ToDoTaskDto> {
        const response = await apiClient.post<ToDoTaskDto>(
            METHOD_CREATE, data
        )
        return response.data;
    }

    async updateTask(
        id: number,
        data: UpdateTaskRequestDto,
    ): Promise<ToDoTaskDto> {
        const response = await apiClient.put<ToDoTaskDto>(
            `${METHOD_UPDATE}/${id}`, data
        )
        return response.data;
    }

    async deleteTask(id: number): Promise<void> {
        await apiClient.delete(`${METHOD_DELETE}/${id}`)
    }
}
export const tasksService = new TasksService();
