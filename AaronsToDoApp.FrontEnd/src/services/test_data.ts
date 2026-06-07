import type { ToDoTaskDto } from "./types";

export const testTasks: ToDoTaskDto[] = [
    {
        id: 3,
        name: 'A - Task 3',
        createdUTC: new Date('2026-06-06T19:38:16.207'),
        completedUTC: null,
        deadlineUTC: null,
        description: "This is a test description",
    },
    {
        id: 2,
        name: 'A - Task 2',
        createdUTC: new Date('2026-06-06T19:38:13.215'),
        completedUTC: null,
        deadlineUTC: new Date('2026-06-20T19:38:16.207'),
        description: null,
    },
    {
        id: 1,
        name: 'A - Task 1',
        createdUTC: new Date('2026-06-06T19:38:08.848'),
        completedUTC: new Date('2026-06-07T19:38:13.215'),
        deadlineUTC: null,
        description: null,
    },
];
