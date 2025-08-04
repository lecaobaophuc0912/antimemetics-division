import { Transform } from 'class-transformer';

export function TransformDate() {
    return Transform(({ value }) => {
        if (value === undefined || value === null) return value;

        // Handle different date formats
        if (typeof value === 'string') {
            // Try parsing as ISO string
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                return date;
            }

            // Try parsing as timestamp
            const timestamp = parseInt(value);
            if (!isNaN(timestamp)) {
                const dateFromTimestamp = new Date(timestamp);
                if (!isNaN(dateFromTimestamp.getTime())) {
                    return dateFromTimestamp;
                }
            }
        }

        // If it's already a Date object, return as is
        if (value instanceof Date) {
            return value;
        }

        // Return original value if can't parse (validation will catch this)
        return value;
    });
} 