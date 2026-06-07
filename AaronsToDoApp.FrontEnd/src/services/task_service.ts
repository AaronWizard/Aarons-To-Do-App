import type {
    CreateTaskRequestDto,
    PagedDto,
    ToDoTaskDto,
    UpdateTaskRequestDto
} from "./types";
import { testTasks } from "./test_data";

class TasksService {
    private tasks: ToDoTaskDto[] = testTasks.map((t) => ({ ...t }));
    private nextId: number = 4;

    async getPaginatedTasks(
        page: number,
        pageSize: number,
        _signal: AbortSignal
    ): Promise<PagedDto<ToDoTaskDto>> {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const items = this.tasks.slice(start, end);
        return {
            items: items.map((t) => ({ ...t })),
            page,
            pageSize,
            totalPages: Math.max(1, Math.ceil(this.tasks.length / pageSize)),
        };
    }

    async createTask(data: CreateTaskRequestDto): Promise<ToDoTaskDto> {
        const task: ToDoTaskDto = {
            id: this.nextId++,
            name: data.name,
            createdUTC: new Date(),
            completedUTC: null,
            deadlineUTC: data.deadlineUTC,
            description: data.description,
        };
        this.tasks.unshift(task);
        return { ...task };
    }

    async updateTask(
        id: number,
        data: UpdateTaskRequestDto,
    ): Promise<ToDoTaskDto> {
        const index = this.tasks.findIndex((t) => t.id === id);
        if (index === -1) throw new Error(`Task with id ${id} not found`);
        this.tasks[index] = {
            ...this.tasks[index],
            name: data.name,
            completedUTC: data.completedUTC,
            deadlineUTC: data.deadlineUTC,
            description: data.description,
        };
        return { ...this.tasks[index] };
    }

    async deleteTask(id: number): Promise<void> {
        const index = this.tasks.findIndex((t) => t.id === id);
        if (index === -1) throw new Error(`Task with id ${id} not found`);
        this.tasks.splice(index, 1);
    }
}
export const tasksService = new TasksService();
