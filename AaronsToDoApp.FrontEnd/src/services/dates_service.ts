const dateFormatter = new Intl.DateTimeFormat('en-CA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
});

export function formatDate(date: Date): string {
    return dateFormatter.format(date);
}
