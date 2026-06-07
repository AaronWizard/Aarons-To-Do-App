import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

import { tasksService } from '../../../services/task_service';
import type { PagedDto, ToDoTaskDto } from '../../../services/types';

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
    const [pagedData, setPagedData] = useState<PagedDto<ToDoTaskDto> | null>(
        null,
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Update list of tasks when page, page size, or refresh key changes.
    useEffect(() => {
        let cancelled = false;

        async function fetchPage() {
            setIsLoading(true);
            setError(null);
            try {
                const data = await tasksService.getPaginatedTasks(page, pageSize);
                if (cancelled) return;

                setPagedData(data);

                // If the current page is now beyond the last page (e.g. after
                // deleting the only item on the last page), step back.
                if (data.totalPages > 0 && page > data.totalPages) {
                    setPage(data.totalPages);
                }
            } catch (err) {
                if (!cancelled) {
                    setError('Failed to load tasks.');
                    console.error(err);
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        fetchPage();
        return () => {
            cancelled = true;
        };
    }, [page, pageSize, refreshKey]);

    if (isLoading && pagedData === null) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    const showPagination = (pagedData !== null) && (pagedData.totalPages > 1);

    return (
        <Box>
            {/* Inline loading indicator while already showing data */}
            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    <CircularProgress size={22} />
                </Box>
            )}

            <TaskList tasks={pagedData?.items ?? []} onUpdated={onUpdated} />

            {
                showPagination &&
                <PageNav
                    page={page}
                    totalPages={pagedData.totalPages}
                    isLoading={isLoading}
                    onSetPage={setPage}
                />
            }
        </Box>
    );
}
