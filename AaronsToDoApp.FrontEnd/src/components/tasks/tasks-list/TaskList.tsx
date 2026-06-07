import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import type { ToDoTaskDto } from '../../../services/types';
import TaskItem from './TaskItem';

interface TaskListProps {
    tasks: ToDoTaskDto[];
    /** Called on update or delete so the parent can refresh. */
    onUpdated: () => void;
}

export default function TaskList({ tasks, onUpdated }: TaskListProps) {
    if (tasks.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography color="text.secondary">No tasks found.</Typography>
            </Box>
        );
    }

    return (
        <Box>
            {tasks.map((task) => (
                <TaskItem key={task.id} task={task} onUpdated={onUpdated} />
            ))}
        </Box>
    );
}
