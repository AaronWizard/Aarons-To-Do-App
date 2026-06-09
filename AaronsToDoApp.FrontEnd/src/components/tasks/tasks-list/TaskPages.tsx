import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Box, CircularProgress, Typography } from '@mui/material';

import { tasksService } from '../../../services/task_service';

import TaskList from './TaskList';
import PageNav from '../../PageNav';

interface TaskPagesProps {
    pageSize: number,
    /**
     * Parent will increment this value to trigger a data refresh without
     * changing the page.
     */
    refreshKey: number;
    onUpdated: () => void;
}

export default function TaskPages(
    { pageSize, refreshKey, onUpdated }: TaskPagesProps
) {
    const [page, setPage] = useState(1);

    const {
        data: pagedData,
        isPending,
        isFetching,
        error
    } = useQuery({
        // Trigger re-fetch when these change
        queryKey: ['tasks', { page, pageSize, refreshKey }],

        queryFn: async ({ signal }) => {
            return tasksService.getPaginatedTasks(page, pageSize, signal);
        },
        placeholderData: keepPreviousData
    });

    // Render-Phase state update
    // Don't go out of page bounds.
    if (pagedData && (pagedData.totalPages > 0)
        && (page > pagedData.totalPages)) {
        setPage(pagedData.totalPages);
    }

    if (isPending) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error && !pagedData) {
        return (
            <Box sx={{ textAlign: 'center' }}>
                <Typography color="error">Failed to load tasks.</Typography>
            </Box>
        );
    }

    const showPagination = (pagedData?.totalPages ?? 0) > 1;

    return (
        <Box>
            {/* Reserve fixed space for progress circle. */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                height: 22
            }}>
                {isFetching && !isPending && <CircularProgress size={22} />}
            </Box>

            {error && pagedData && (
                <Box sx={{ textAlign: 'center' }}>
                    <Typography color="error">
                        Failed to update tasks. Showing previously loaded data.
                    </Typography>
                </Box>
            )}

            {/* Fixed page size for stable UI. */}
            <Box>
                <TaskList
                    tasks={pagedData?.items ?? []}
                    onUpdated={onUpdated}
                />
            </Box>

            {
                showPagination &&
                <PageNav
                    page={page}
                    totalPages={pagedData.totalPages}
                    isLoading={isFetching}
                    onSetPage={setPage}
                />
            }
        </Box>
    );
}
