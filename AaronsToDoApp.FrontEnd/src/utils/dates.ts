const dateFormatter = new Intl.DateTimeFormat('en-CA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
});

export function formatDate(date: Date): string {
    return dateFormatter.format(date);
}


/** Converts a Date to a "YYYY-MM-DD" input string. */
export function dateToInputValue(date: Date | null): string {
    if (!date) {
        return ''
    };

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

/** Converts a "YYYY-MM-DD" input string back to a Date. */
export function inputValueToDate(value: string): Date | null {
    if (!value) {
        return null
    };
    const [year, month, date] = value.split('-').map(Number);
    return new Date(year, month - 1, date);
}
