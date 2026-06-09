import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{ py: 2, textAlign: 'center' }}
        >
            <Typography variant="body2" color="text.secondary">
                Aaron MacDonald &copy; 2026
            </Typography>
        </Box>
    );
}
