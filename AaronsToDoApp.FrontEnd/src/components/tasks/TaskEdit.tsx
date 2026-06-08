import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Box,
    Button,
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
import { dateToInputValue, inputValueToDate }
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
            deadline: dateToInputValue(task.deadlineUTC),
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

    // Update state synchronously during render only when task prop changes
    const [prevTaskProp, setPrevTaskProp] = useState(task);
    if (task !== prevTaskProp) {
        setPrevTaskProp(task);
        setForm(buildInitialForm(task));
        setNameError(false);
    }

    const saveMutation = useMutation({
        mutationFn: async () => {
            const deadlineDate = inputValueToDate(form.deadline);
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
                    ? (task.completedUTC ?? new Date())
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
            onSaved();
            onClose();
        }
    });

    // User saved.
    function handleSave() {
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

            <DialogContent>
                <Box sx={{
                    display: 'flex', flexDirection: 'column', gap: 2, pt: 1
                }}>
                    <TextField
                        label="Name"
                        value={form.name}
                        onChange={(e) => {
                            setForm((f) => ({ ...f, name: e.target.value }));
                            if (nameError) {
                                setNameError(false);
                            }
                        }}
                        error={nameError}
                        helperText={nameError ? 'Name is required.' : ''}
                        required
                        fullWidth
                        autoFocus
                    />

                    <TextField
                        label="Deadline"
                        type="date"
                        value={form.deadline}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, deadline: e.target.value }))
                        }
                        fullWidth
                        slotProps={{ inputLabel: { shrink: true } }}
                    />

                    <TextField
                        label="Description"
                        value={form.description}
                        onChange={(e) =>
                            setForm((f) =>
                                ({ ...f, description: e.target.value })
                            )
                        }
                        fullWidth
                        multiline
                        rows={3}
                    />

                    {!isCreateMode && (
                        <FormControlLabel
                            control={
                                <Switch
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
                    variant="contained"
                    onClick={handleSave}
                    disabled={saveMutation.isPending}
                >
                    {
                        saveMutation.isPending ? 'Saving'
                            : isCreateMode ? 'Add' : 'Save'
                    }
                </Button>
            </DialogActions>
        </Dialog>
    );
}
