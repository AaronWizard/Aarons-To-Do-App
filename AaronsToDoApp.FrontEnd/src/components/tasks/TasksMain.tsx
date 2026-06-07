import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';

import TaskPages from './tasks-list/TaskPages';

const PAGE_SIZE = 20;

export default function TasksMain() {
    // Incrementing this key tells TaskPages to re-fetch the current page.
    // Any component that performs a mutation should call handleUpdate().
    const [refreshKey, setRefreshKey] = useState(0);

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
                >
                    Add Task
                </Button>
            </Box>

            <TaskPages
                pageSize={PAGE_SIZE}
                refreshKey={refreshKey}
                onUpdated={handleUpdate}
            />
        </Container>
    );
}
