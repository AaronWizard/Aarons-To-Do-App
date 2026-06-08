import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Alert, Box, Button, CircularProgress, TextField, Typography } from "@mui/material";

import { userService } from "../../services/user_service";
import { ApiError } from "../../utils/errors";

interface LoginProps {
    nextURL: string;
}

interface FormState {
    email: string;
    password: string;
}

const ErrorState = {
    none: 'none',
    login: 'login',
    other: 'other'
} as const;
type ErrorState = (typeof ErrorState)[keyof typeof ErrorState];

export default function Login({ nextURL }: LoginProps) {
    const navigate = useNavigate();

    const [form, setForm] = useState<FormState>({ email: '', password: '' });

    const [errorState, setErrorState] = useState<ErrorState>(ErrorState.none);

    const loginMutation = useMutation({
        mutationFn: async () => {
            return userService.login(form.email, form.password)
        },
        onSuccess: () => {
            navigate(nextURL);
        },
        onError: (error) => {
            const apiError = error as ApiError;
            if (apiError && apiError.isClientError()) {
                setErrorState(ErrorState.login);
            }
            else {
                setErrorState(ErrorState.other);
            }
        }
    });

    function handleLogin() {
        if (!form.email.trim() || !form.password.trim()) {
            setErrorState(ErrorState.login);
            return;
        }
        loginMutation.mutate();
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignSelf: 'center',
            gap: 2,
            pt: 1,
            maxWidth: 'sm'
        }}>
            <Typography component="h2">
                Login
            </Typography>

            {
                (errorState != ErrorState.none) &&
                <Alert severity="error">
                    {
                        (
                            (errorState == ErrorState.login)
                            && 'Invalid username or password.'
                        )
                        || 'An error occurred. Please try again later.'
                    }
                </Alert>
            }

            <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={
                    e => setForm((f) => ({ ...f, email: e.target.value }))
                }
                disabled={loginMutation.isPending}
                error={errorState == ErrorState.login}
                required
                fullWidth
                autoFocus
            />
            <TextField
                label="Password"
                type="password"
                value={form.password}
                onChange={
                    e => setForm((f) => ({ ...f, password: e.target.value }))
                }
                disabled={loginMutation.isPending}
                error={errorState == ErrorState.login}
                required
                fullWidth
                autoFocus
            />

            {
                loginMutation.isPending ?
                    <CircularProgress
                        sx={{ marginLeft: "auto", marginRight: 3 }} size={30}
                    />
                    :
                    <Button
                        variant="contained"
                        sx={{ marginLeft: "auto" }}
                        onClick={handleLogin}
                        disabled={loginMutation.isPending}
                    >
                        Log In
                    </Button>
            }

        </Box>
    );
}
