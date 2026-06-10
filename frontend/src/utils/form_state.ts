export const FormStatus = {
    ok: 'ok',
    validationError: 'validationError',
    otherError: 'otherError'
} as const;
export type FormStatus = (typeof FormStatus)[keyof typeof FormStatus];
