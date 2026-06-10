import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Switch,
    TextField
} from '@mui/material';

import type {
    CreateTaskRequestDto,
    ToDoTaskDto,
    UpdateTaskRequestDto,
} from '../../api/types';
import { tasksService } from '../../services/task_service';
import { utcStringToInputValue, inputValueToUTCDateString }
    from '../../utils/dates';

interface TaskEditProps {
    open: boolean;
    /** Omit for create mode. Provide for edit mode. */
    task?: ToDoTaskDto;
    onClose: () => void;
    /**
     * Called after a successful save. The parent is responsible for
     * closing the dialog (via onClose) and refreshing data.
     */
    onSaved: () => void;
}

interface FormState {
    name: string;
    /** Date input string. e.g. "2026-06-15" */
    deadline: string;
    description: string;
    completed: boolean;
}

function buildInitialForm(task?: ToDoTaskDto): FormState {
    if (task) {
        return {
            name: task.name,
            deadline: utcStringToInputValue(task.deadlineUTC),
            description: task.description ?? '',
            completed: task.completedUTC !== null,
        };
    }
    else {
        return { name: '', deadline: '', description: '', completed: false };
    }
}

export default function TaskEdit({
    open,
    task,
    onClose,
    onSaved,
}: TaskEditProps) {
    const isCreateMode = task === undefined;
    const queryClient = useQueryClient();

    const [form, setForm] = useState<FormState>(buildInitialForm(task));

    const [nameError, setNameError] = useState(false);
    const [otherError, setOtherError] = useState(false);

    // Update state synchronously during render only when task prop changes
    const [prevTaskProp, setPrevTaskProp] = useState(task);
    if (task !== prevTaskProp) {
        setPrevTaskProp(task);
        setForm(buildInitialForm(task));
        setNameError(false);
    }

    const saveMutation = useMutation({
        mutationFn: async () => {
            const deadlineDate = inputValueToUTCDateString(form.deadline);
            const trimmedDescription = form.description.trim() || null;

            if (isCreateMode) {
                const data: CreateTaskRequestDto = {
                    name: form.name.trim(),
                    deadlineUTC: deadlineDate,
                    description: trimmedDescription,
                };
                return tasksService.createTask(data);
            }
            else {
                // When toggling "completed" on, preserve the original
                // completedUTC if it already exists. Otherwise use the current
                // time.
                const completedUTC = form.completed
                    ? (task.completedUTC ?? new Date().toISOString())
                    : null;
                const data: UpdateTaskRequestDto = {
                    name: form.name.trim(),
                    completedUTC,
                    deadlineUTC: deadlineDate,
                    description: trimmedDescription,
                };
                return tasksService.updateTask(task.id, data);
            }
        },
        onSuccess: () => {
            // Invalidate task list query to trigger UI update
            queryClient.invalidateQueries({ queryKey: ['tasks'] });

            // Clean up and close
            setForm(buildInitialForm()); // Clear task
            setNameError(false);
            setOtherError(false);
            onSaved();
            onClose();
        },
        onError: () => {
            setOtherError(true);
        }
    });

    // User saved.
    function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        if (!form.name.trim()) {
            setNameError(true);
            return;
        }
        saveMutation.mutate();
    }

    // User closed edit form.
    function handleClose() {
        setForm(buildInitialForm(task));
        setNameError(false);
        onClose();
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isCreateMode ? 'Add Task' : 'Edit Task'}</DialogTitle>

            <DialogContent sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Box
                    id="edit-task-form"
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate>
                    {
                        otherError &&
                        <Alert severity="error">
                            An error occurred. Please try again later.
                        </Alert>
                    }

                    <TextField
                        id="name"
                        label="Name"
                        name="name"
                        value={form.name}
                        onChange={(e) => {
                            setForm((f) => ({ ...f, name: e.target.value }));
                            if (nameError) {
                                setNameError(false);
                            }
                        }}
                        disabled={saveMutation.isPending}
                        error={nameError}
                        required
                        fullWidth
                        margin="normal"
                        autoFocus
                        helperText={nameError ? 'Name is required.' : ''}
                    />

                    <TextField
                        id="deadline"
                        label="Deadline"
                        name="deadline"
                        type="date"
                        value={form.deadline}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, deadline: e.target.value }))
                        }
                        disabled={saveMutation.isPending}
                        fullWidth
                        margin="normal"
                        slotProps={{ inputLabel: { shrink: true } }}
                    />

                    <TextField
                        id="description"
                        label="Description"
                        name="description"
                        value={form.description}
                        onChange={(e) =>
                            setForm((f) =>
                                ({ ...f, description: e.target.value })
                            )
                        }
                        disabled={saveMutation.isPending}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={3}
                    />

                    {!isCreateMode && (
                        <FormControlLabel
                            control={
                                <Switch
                                    id="completed"
                                    name="completed"
                                    checked={form.completed}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f, completed: e.target.checked
                                        }))
                                    }
                                />
                            }
                            label="Completed"
                        />
                    )}
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} disabled={saveMutation.isPending}>
                    Cancel
                </Button>
                <Button
                    type="submit" form="edit-task-form"
                    disabled={saveMutation.isPending}
                >
                    {
                        saveMutation.isPending ?
                            <CircularProgress size={24} color="inherit" />
                            : (isCreateMode ? 'Add' : 'Save')
                    }
                </Button>
            </DialogActions>
        </Dialog>
    );
}
