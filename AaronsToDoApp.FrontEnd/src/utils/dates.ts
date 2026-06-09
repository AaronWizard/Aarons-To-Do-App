const dateFormatter = new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
});

export function formatDateString(date: string): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
        throw new Error(`Invalid date value: ${date}`);
    }
    return dateFormatter.format(d);
}

/** Converts an UTC ISO string to a "YYYY-MM-DD" input value. */
export function utcStringToInputValue(date: string | null): string {
    if (!date) {
        return ''
    };
    return date.slice(0, 10); // ISO 8601 always starts with "YYYY-MM-DD"
}

/** Converts a "YYYY-MM-DD" input value to a UTC ISO string (midnight UTC). */
export function inputValueToUTCDateString(value: string): string | null {
    if (!value) {
        return null
    };
    return `${value}T00:00:00.000Z`;
}
