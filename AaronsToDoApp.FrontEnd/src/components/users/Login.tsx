import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
    Alert,
    Box,
    Button,
    TextField,
    Typography
} from "@mui/material";

import { useAuth } from "../auth/useAuth";
import { ApiError } from "../../utils/errors";
import { FormStatus } from "../../utils/form_state";

interface LoginProps {
    nextURL: string;
}

interface FormState {
    email: string;
    password: string;
}

export default function Login({ nextURL }: LoginProps) {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState<FormState>({ email: '', password: '' });

    const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.ok);

    const loginMutation = useMutation({
        mutationFn: async () => {
            return login(form.email, form.password);
        },
        onSuccess: () => {
            navigate(nextURL);
        },
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

    function handleLogin() {
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
            alignSelf: 'center',
            gap: 2,
            pt: 1,
            maxWidth: 'sm'
        }}>
            <Typography component="h2">
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

            <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={
                    e => setForm((f) => ({ ...f, email: e.target.value }))
                }
                disabled={loginMutation.isPending}
                error={formStatus == FormStatus.validationError}
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
                error={formStatus == FormStatus.validationError}
                required
                fullWidth
                autoFocus
            />

            <Button
                variant="contained"
                sx={{ marginLeft: "auto" }}
                onClick={handleLogin}
                disabled={loginMutation.isPending}
            >
                {loginMutation.isPending ? 'Logging In' : 'Log In'}
            </Button>
        </Box>
    );
}
