import { useState } from "react";
import { useNavigate, Link as RouterLink } from 'react-router';
import { useMutation } from "@tanstack/react-query";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Link,
    TextField,
    Typography
} from "@mui/material";

import { useAuth } from "../auth/useAuth";
import { ApiError } from "../../utils/errors";
import { FormStatus } from "../../utils/form_state";

interface LoginProps {
    nextUrl: string;
    registerUrl: string;
}

interface FormState {
    email: string;
    password: string;
}

export default function Login({ nextUrl, registerUrl }: LoginProps) {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState<FormState>({ email: '', password: '' });
    const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.ok);

    const loginMutation = useMutation({
        mutationFn: async () => login(form.email, form.password),
        onSuccess: () => navigate(nextUrl),
        onError: (error) => {
            const apiError = error as ApiError;
            if (apiError && apiError.isClientError()) {
                setFormStatus(FormStatus.validationError);
            }
            else {
                setFormStatus(FormStatus.otherError);
            }
        }
    });

    function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        if (!form.email.trim() || !form.password.trim()) {
            setFormStatus(FormStatus.validationError);
            return;
        }
        loginMutation.mutate();
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <Typography component="h2" variant="h5">
                Login
            </Typography>

            {
                (formStatus != FormStatus.ok) &&
                <Alert severity="error">
                    {
                        (
                            (formStatus == FormStatus.validationError)
                            && 'Invalid username or password.'
                        )
                        || 'An error occurred. Please try again later.'
                    }
                </Alert>
            }

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
            >
                <TextField
                    id="email"
                    label="Email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={
                        e => setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    disabled={loginMutation.isPending}
                    error={formStatus == FormStatus.validationError}
                    required
                    fullWidth
                    margin="normal"
                    autoFocus
                />
                <TextField
                    id="password"
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(e) => setForm((f) => (
                        { ...f, password: e.target.value }
                    ))}
                    disabled={loginMutation.isPending}
                    error={formStatus == FormStatus.validationError}
                    required
                    fullWidth
                    margin="normal"
                    autoFocus
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, height: '42px' }}
                    disabled={loginMutation.isPending}
                >
                    {
                        loginMutation.isPending ?
                            <CircularProgress size={24} color="inherit" />
                            : 'Log In'
                    }
                </Button>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Typography>
                    Need an account?{' '}
                    <Link component={RouterLink} to={registerUrl}>
                        Register
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
}
