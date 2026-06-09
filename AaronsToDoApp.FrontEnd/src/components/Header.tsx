import {
    AppBar,
    Toolbar,
    Typography
} from '@mui/material';

import Logout from './users/Logout';
import { useAuth } from './auth/useAuth';

export default function Header() {
    const { isAuthenticated } = useAuth();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Aaron's To-Do App
                </Typography>
                {isAuthenticated && <Logout />}
            </Toolbar>
        </AppBar>
    );
}
