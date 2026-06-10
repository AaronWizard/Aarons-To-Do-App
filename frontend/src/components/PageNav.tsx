import { Box, Button, Typography } from "@mui/material";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface PageNavProps {
    page: number,
    totalPages: number,
    isLoading: boolean,
    onSetPage: (p: number) => void
}

export default function PageNav({
    page, totalPages, isLoading, onSetPage
}: PageNavProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                mt: 2,
            }}
        >
            <Button
                startIcon={<NavigateBeforeIcon />}
                onClick={() => onSetPage(Math.max(1, page - 1))}
                disabled={page === 1 || isLoading}
            >
                Prev
            </Button>

            <Typography variant="body2" color="text.secondary">
                Page {page} of {totalPages}
            </Typography>

            <Button
                endIcon={<NavigateNextIcon />}
                onClick={() =>
                    onSetPage(Math.min(totalPages, page + 1))
                }
                disabled={page === totalPages || isLoading}
            >
                Next
            </Button>
        </Box>
    )
}
