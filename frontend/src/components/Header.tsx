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
            <Toolbar sx={{ gap: 1 }}>
                <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
                    Aaron's To-Do App
                </Typography>
                {isAuthenticated && <UserEmailLabel />}
                {isAuthenticated && <Logout />}
            </Toolbar>
        </AppBar>
    );
}
