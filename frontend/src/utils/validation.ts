import type { PasswordRequirementsDto } from "../api/types";

class Validation {
    validateEmail(email: string): string {
        let result = '';
        if (!email) {
            result = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            result = 'Please enter a valid email address';
        }
        return result;
    }

    validatePassword(
        password: string,
        requirements: PasswordRequirementsDto | undefined): string {
        let result = '';
        if (!password) {
            result = 'Password is required';
        } else if (requirements) {
            const passwordRules: string[] = [];

            if (password.length < requirements.requiredLength) {
                passwordRules.push(
                    `at least ${requirements.requiredLength} characters`
                );
            }
            if (requirements.requireDigit && !/\d/.test(password)) {
                passwordRules.push('a digit');
            }
            if (requirements.requireLowercase && !/[a-z]/.test(password)) {
                passwordRules.push('a lowercase letter');
            }
            if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
                passwordRules.push('an uppercase letter');
            }
            if (requirements.requireNonAlphanumeric
                && !/[^a-zA-Z0-9]/.test(password)) {
                passwordRules.push('a special character');
            }

            const uniqueCount = new Set(password).size;
            if (uniqueCount < requirements.requiredUniqueChars) {
                passwordRules.push(
                    `at least ${requirements.requiredUniqueChars} `
                    + `unique characters`
                );
            }

            if (passwordRules.length > 0) {
                result = `Password must include: ${passwordRules.join(', ')}.`;
            }
        }
        return result;
    }
}
export const validation = new Validation();
