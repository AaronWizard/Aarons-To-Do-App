import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import {
    Box,
    Card,
    CircularProgress,
    IconButton,
    Tooltip,
    Typography
} from '@mui/material';

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { tasksService } from '../../../services/task_service';
import type { ToDoTaskDto, UpdateTaskRequestDto } from '../../../api/types';
import { formatDateString } from '../../../utils/dates';

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
    if (task.completedUTC !== null) {
        return false;
    }
    if (task.deadlineUTC !== null) {
        const deadlineDate = new Date(task.deadlineUTC);
        return deadlineDate < new Date();
    }
    return false;
}

export default function TaskItem({ task, onUpdated }: TaskItemProps) {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    const overdue = isOverdue(task);
    const completed = task.completedUTC !== null;

    const toggleMutation = useMutation({
        mutationFn: (data: UpdateTaskRequestDto) =>
            tasksService.updateTask(task.id, data),
        onSuccess: () => {
            onUpdated();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () => tasksService.deleteTask(task.id),
        onSuccess: () => {
            onUpdated();
        },
    });

    function handleToggle(): void {
        const data: UpdateTaskRequestDto = {
            name: task.name,
            completedUTC: completed ? null : new Date().toISOString(),
            deadlineUTC: task.deadlineUTC,
            description: task.description,
        };
        toggleMutation.mutate(data);
    }

    function handleDelete(): void {
        setIsDeleteConfirmOpen(false);
        deleteMutation.mutate();
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
                                Due: {formatDateString(task.deadlineUTC)}
                            </Typography>
                        )}
                    </Box>
                </Box>

                <Box sx={{
                    display: 'flex', alignItems: 'center', pr: 1, gap: 0.25
                }}>
                    {/* Complete toggle button */}
                    {
                        toggleMutation.isPending ?
                            <Box sx={{ p: 0.5, display: 'flex' }}>
                                <CircularProgress size={20} />
                            </Box>
                            :
                            <Tooltip
                                title={completed ?
                                    'Mark incomplete' : 'Mark complete'
                                }
                            >
                                <IconButton
                                    size="small"
                                    color={completed ? 'default' : 'success'}
                                    onClick={handleToggle}
                                    disabled={
                                        toggleMutation.isPending
                                        || deleteMutation.isPending
                                    }
                                    aria-label={
                                        completed ?
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
                            </Tooltip>
                    }

                    {/* Edit button */}
                    <Tooltip title="Edit">
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => setIsEditOpen(true)}
                            disabled={
                                toggleMutation.isPending
                                || deleteMutation.isPending
                            }
                            aria-label="Edit task"
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>

                    {/* Delete button */}
                    {
                        deleteMutation.isPending ?
                            <Box sx={{ p: 0.5, display: 'flex' }}>
                                <CircularProgress size={20} color="error" />
                            </Box>
                            :
                            <Tooltip title="Delete">
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => setIsDeleteConfirmOpen(true)}
                                    disabled={
                                        toggleMutation.isPending
                                        || deleteMutation.isPending
                                    }
                                    aria-label="Delete task"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                    }
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
                isDeleting={deleteMutation.isPending}
                closeConfirm={() => setIsDeleteConfirmOpen(false)}
                handleDelete={handleDelete}
            />
        </>
    );
}
