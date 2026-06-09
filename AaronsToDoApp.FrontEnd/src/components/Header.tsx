import {
    AppBar,
    Toolbar,
    Typography
} from '@mui/material';

import { useAuth } from './auth/useAuth';

import UserEmailLabel from './users/UserEmailLabel';
import Logout from './users/Logout';

export default function Header() {
    const { isAuthenticated } = useAuth();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ mr: 2, flexGrow: 1 }}>
                    Aaron's To-Do App
                </Typography>
                {isAuthenticated && <UserEmailLabel />}
                {isAuthenticated && <Logout />}
            </Toolbar>
        </AppBar>
    );
}
