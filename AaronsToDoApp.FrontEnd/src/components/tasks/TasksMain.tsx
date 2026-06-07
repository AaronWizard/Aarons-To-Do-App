import { useState } from 'react';
import {
    Box,
    Button,
    Container,
    Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import TaskPages from './tasks-list/TaskPages';
import TaskEdit from './TaskEdit';

const PAGE_SIZE = 20;

export default function TasksMain() {
    // Incrementing this key tells TaskPages to re-fetch the current page.
    // Any component that performs a mutation should call handleUpdate().
    const [refreshKey, setRefreshKey] = useState(0);

    const [isAddOpen, setIsAddOpen] = useState(false);

    function handleUpdate(): void {
        setRefreshKey((k) => k + 1);
    }

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                }}
            >
                <Typography variant="h5" component="h1">
                    My Tasks
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setIsAddOpen(true)}
                >
                    Add Task
                </Button>
            </Box>

            <TaskPages
                pageSize={PAGE_SIZE}
                refreshKey={refreshKey}
                onUpdated={handleUpdate}
            />

            <TaskEdit
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSaved={() => {
                    setIsAddOpen(false);
                    handleUpdate();
                }}
            />
        </Container>
    );
}
