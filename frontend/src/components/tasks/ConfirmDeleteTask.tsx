import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

interface ConfirmDeleteTaskProps {
    isDeleteConfirmOpen: boolean,
    taskName: string,
    isDeleting: boolean,
    closeConfirm: () => void,
    handleDelete: () => void
}

export default function ConfirmDeleteTask({
    isDeleteConfirmOpen, taskName, isDeleting, closeConfirm, handleDelete
}: ConfirmDeleteTaskProps) {
    return (
        <Dialog
            open={isDeleteConfirmOpen}
            onClose={closeConfirm}
        >
            <DialogTitle>Delete Task?</DialogTitle>
            <DialogContent>
                <Typography>
                    Are you sure you want to delete &ldquo;{taskName}&rdquo;?
                    This cannot be undone.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={closeConfirm}
                    disabled={isDeleting}
                >
                    Cancel
                </Button>
                <Button
                    color="error" onClick={handleDelete} disabled={isDeleting}
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}
