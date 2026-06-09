import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    Link,
    CircularProgress
} from '@mui/material';

import { validation } from '../../utils/validation';
import { userService } from '../../services/user_service';
import type { ApiError } from '../../utils/errors';

interface RegisterProps {
    loginUrl: string;
}

interface FormState {
    email: string;
    password: string;
    confirmPassword: string;
}

interface FormErrors {
    email?: string;
    password?: string;
    confirmPassword?: string;
}

export default function Register({ loginUrl }: RegisterProps) {
    const [form, setForm] = useState<FormState>(
        { email: '', password: '', confirmPassword: '' }
    );
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [apiError, setAPIError] = useState<string | null>(null);

    // Get password requirements
    const {
        data: passwordRequirements,
        isError: isReqError
    } = useQuery({
        queryKey: ['passwordRequirements'],
        queryFn: async () => {
            const result = await userService.passwordRequirements();
            if (!result) {
                throw new Error('Failed to load requirements');
            }
            return result;
        },
        retry: false,
    });

    // Submit registration
    const registrationMutation = useMutation({
        mutationFn: () => userService.register(form.email, form.password),
        onError: (error) => {
            const apiError = error as ApiError;
            if (apiError && apiError.isClientError()) {
                setAPIError(apiError.message);
            }
        }
    });

    function validateForm(): boolean {
        const localErrors: FormErrors = {};

        const emailError = validation.validateEmail(form.email);
        if (emailError) {
            localErrors.email = emailError;
        }
        const passwordError = validation.validatePassword(
            form.password, passwordRequirements
        )
        if (passwordError) {
            localErrors.password = passwordError;
        }

        if (!form.confirmPassword) {
            localErrors.confirmPassword = 'Please confirm your password';
        } else if (form.password !== form.confirmPassword) {
            localErrors.confirmPassword = 'Passwords do not match';
        }

        setFormErrors(localErrors);
        return Object.keys(localErrors).length === 0;
    };

    function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        setAPIError(null);
        if (validateForm()) {
            registrationMutation.mutate();
        }
    };

    if (registrationMutation.isSuccess) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Typography component="h2" variant="h5" gutterBottom>
                    Register
                </Typography>
                <Typography>
                    Registration complete.{' '}
                    <Link component={RouterLink} to="/login">
                        Login
                    </Link>
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <Typography component="h2" variant="h5">
                Register
            </Typography>

            {(isReqError || registrationMutation.isError || apiError) && (
                <Alert severity="error">
                    {
                        apiError ?
                            apiError
                            : 'An error occurred. Please try again later.'
                    }
                </Alert>
            )}

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
                    onChange={(e) => setForm((f) => (
                        { ...f, email: e.target.value }
                    ))}
                    disabled={registrationMutation.isPending}
                    error={!!formErrors.email}
                    required
                    fullWidth
                    margin="normal"
                    autoFocus
                    helperText={formErrors.email}
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
                    disabled={registrationMutation.isPending}
                    error={!!formErrors.password}
                    required
                    fullWidth
                    margin="normal"
                    autoFocus
                    helperText={formErrors.password}
                />
                <TextField
                    id="confirmPassword"
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm((f) => (
                        { ...f, confirmPassword: e.target.value }
                    ))}
                    disabled={registrationMutation.isPending}
                    error={!!formErrors.confirmPassword}
                    required
                    fullWidth
                    margin="normal"
                    autoFocus
                    helperText={formErrors.confirmPassword}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, height: '42px' }}
                    disabled={registrationMutation.isPending || isReqError}
                >
                    {
                        registrationMutation.isPending ?
                            <CircularProgress size={24} color="inherit" />
                            : 'Register'
                    }
                </Button>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Typography>
                    Already have an account?{' '}
                    <Link component={RouterLink} to={loginUrl}>
                        Login
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
};
