import {
    Box,
    Card,
    IconButton,
    Tooltip,
    Typography
} from '@mui/material';

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { useState } from 'react';

import type { ToDoTaskDto, UpdateTaskRequestDto }
    from '../../../services/types';
import { tasksService } from '../../../services/task_service';
import { formatDate } from '../../../utils/dates';

import styles from './TaskItem.module.scss';
import ConfirmDeleteTask from '../ConfirmDeleteTask';
import TaskEdit from '../TaskEdit';
import TaskDetails from '../TaskDetails';

interface TaskItemProps {
    task: ToDoTaskDto;
    /** Called on update or delete so the parent can refresh. */
    onUpdated: () => void;
}

function isOverdue(task: ToDoTaskDto): boolean {
    return (
        (task.completedUTC === null)
        && (task.deadlineUTC !== null)
        && (task.deadlineUTC < new Date())
    );
}

export default function TaskItem({ task, onUpdated }: TaskItemProps) {
    const [isToggling, setIsToggling] = useState(false);

    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const overdue = isOverdue(task);
    const completed = task.completedUTC !== null;

    async function handleToggleComplete(): Promise<void> {
        setIsToggling(true);
        try {
            const data: UpdateTaskRequestDto = {
                name: task.name,
                completedUTC: completed ? null : new Date(),
                deadlineUTC: task.deadlineUTC,
                description: task.description,
            };
            await tasksService.updateTask(task.id, data);
            onUpdated();
        } finally {
            setIsToggling(false);
        }
    }

    async function handleDelete(): Promise<void> {
        setIsDeleting(true);
        try {
            await tasksService.deleteTask(task.id);
            setIsDeleteConfirmOpen(false);
            onUpdated();
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <>
            <Card
                className={overdue ? styles.overdue : undefined}
                variant="outlined"
                sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
            >
                <Box
                    sx={{ flexGrow: 1, px: 2, py: 1.5, cursor: 'pointer' }}
                    onClick={() => setIsDetailsOpen(true)}
                >
                    <Box
                        component="span"
                        sx={{ display: 'inline-block' }}
                        className={completed ? styles.completed : undefined}
                        color={overdue ? 'error' : undefined}
                    >
                        <Typography
                            component="span"
                            variant="body1"
                            sx={{ mr: 1 }}
                        >
                            {task.name}
                        </Typography>

                        {task.deadlineUTC && (
                            <Typography component="span" variant="caption">
                                Due: {formatDate(task.deadlineUTC)}
                            </Typography>
                        )}
                    </Box>
                </Box>

                <Box sx={{
                    display: 'flex', alignItems: 'center', pr: 1, gap: 0.25
                }}>
                    <Tooltip
                        title={completed ? 'Mark incomplete' : 'Mark complete'}
                    >
                        <span>
                            <IconButton
                                size="small"
                                color={completed ? 'default' : 'success'}
                                onClick={handleToggleComplete}
                                disabled={isToggling}
                                aria-label={completed ?
                                    'Mark incomplete' : 'Mark complete'
                                }
                            >
                                {
                                    completed ?
                                        <CheckBoxIcon
                                            fontSize="small" color="success"
                                        />
                                        : <CheckBoxOutlineBlankIcon />
                                }
                            </IconButton>
                        </span>
                    </Tooltip>

                    <Tooltip title="Edit">
                        <IconButton
                            size="small"
                            color="primary"
                            aria-label="Edit task"
                            onClick={() => setIsEditOpen(true)}
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => setIsDeleteConfirmOpen(true)}
                            aria-label="Delete task"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Card>

            {/* Dialogs */}

            <TaskDetails
                open={isDetailsOpen}
                task={task}
                onUpdated={onUpdated}
                onClose={() => setIsDetailsOpen(false)}
            />

            <TaskEdit
                open={isEditOpen}
                task={task}
                onClose={() => setIsEditOpen(false)}
                onSaved={onUpdated}
            />

            <ConfirmDeleteTask
                isDeleteConfirmOpen={isDeleteConfirmOpen}
                taskName={task.name}
                isDeleting={isDeleting}
                closeConfirm={() => setIsDeleteConfirmOpen(false)}
                handleDelete={handleDelete}
            />
        </>
    );
}
