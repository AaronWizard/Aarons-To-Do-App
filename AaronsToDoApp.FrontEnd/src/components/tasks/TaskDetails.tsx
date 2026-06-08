import { useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    Switch,
    Typography
} from '@mui/material';

import type { ToDoTaskDto, UpdateTaskRequestDto } from '../../services/types';
import { tasksService } from '../../services/task_service';
import { formatDate } from '../../utils/dates';
import ConfirmDeleteTask from './ConfirmDeleteTask';
import TaskEdit from './TaskEdit';

interface TaskDetailsProps {
    open: boolean;
    task: ToDoTaskDto;
    /** Called after a successful completion toggle or delete.
      * Does not close the dialog on its own. */
    onUpdated: () => void;
    onClose: () => void;
}

export default function TaskDetails({
    open,
    task,
    onUpdated,
    onClose
}: TaskDetailsProps) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [isBusy, setIsBusy] = useState(false);

    async function handleToggleComplete(): Promise<void> {
        setIsBusy(true);
        try {
            const data: UpdateTaskRequestDto = {
                name: task.name,
                completedUTC: task.completedUTC ? null : new Date(),
                deadlineUTC: task.deadlineUTC,
                description: task.description,
            };
            await tasksService.updateTask(task.id, data);
            onUpdated();
        } finally {
            setIsBusy(false);
        }
    }

    async function handleDelete(): Promise<void> {
        setIsBusy(true);
        try {
            await tasksService.deleteTask(task.id);
            setIsDeleteConfirmOpen(false);
            onUpdated();
            onClose();
        } finally {
            setIsBusy(false);
        }
    }

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>Task Details</DialogTitle>

                <DialogContent>
                    <Box sx={{
                        display: 'flex', flexDirection: 'column', gap: 2, pt: 1
                    }}>
                        <Typography variant="h6">{task.name}</Typography>

                        <Divider />

                        <Box>
                            <Typography
                                variant="caption" color="text.secondary"
                            >
                                Created
                            </Typography>
                            <Typography>
                                {formatDate(task.createdUTC)}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                variant="caption" color="text.secondary"
                            >
                                Deadline
                            </Typography>
                            <Typography>
                                {
                                    task.deadlineUTC ?
                                        formatDate(task.deadlineUTC) : 'None'
                                }
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                variant="caption" color="text.secondary"
                            >
                                Description
                            </Typography>
                            <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                {task.description ?? 'None'}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                variant="caption" color="text.secondary"
                            >
                                Completed
                            </Typography>
                            <Typography>
                                {
                                    task.completedUTC ?
                                        formatDate(task.completedUTC) : 'No'
                                }
                            </Typography>
                        </Box>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={task.completedUTC !== null}
                                    onChange={handleToggleComplete}
                                    disabled={isBusy}
                                />
                            }
                            label="Completed"
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={() => setIsEditOpen(true)}
                        disabled={isBusy}
                    >
                        Edit
                    </Button>
                    <Button
                        color="error"
                        onClick={() => setIsDeleteConfirmOpen(true)}
                        disabled={isBusy}
                    >
                        Delete
                    </Button>
                    <Box sx={{ flexGrow: 1 }} />
                    <Button onClick={onClose}>Close</Button>
                </DialogActions>
            </Dialog>

            <TaskEdit
                open={isEditOpen}
                task={task}
                onClose={() => setIsEditOpen(false)}
                onSaved={onUpdated}
            />

            <ConfirmDeleteTask
                isDeleteConfirmOpen={isDeleteConfirmOpen}
                taskName={task.name}
                isDeleting={isBusy}
                closeConfirm={() => setIsDeleteConfirmOpen(false)}
                handleDelete={handleDelete}
            />
        </>
    );
}
