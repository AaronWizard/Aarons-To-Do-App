import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';

export default function TasksMain() {
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
        </Container>
    );
}
