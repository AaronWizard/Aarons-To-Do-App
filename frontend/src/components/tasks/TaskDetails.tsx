import { useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Switch,
    Typography
} from '@mui/material';

import type { ToDoTaskDto, UpdateTaskRequestDto } from '../../api/types';
import { tasksService } from '../../services/task_service';
import { formatDateString } from '../../utils/dates';
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
                completedUTC: task.completedUTC ?
                    null : new Date().toISOString(),
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
                <DialogTitle>{task.name}</DialogTitle>

                <DialogContent sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}>
                    <Box>
                        <Typography
                            variant="caption" color="text.secondary"
                        >
                            Created
                        </Typography>
                        <Typography>
                            {formatDateString(task.createdUTC)}
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
                                    formatDateString(task.deadlineUTC)
                                    : 'None'
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
                                    formatDateString(task.completedUTC)
                                    : 'No'
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
                </DialogContent>

                <DialogActions>
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
