import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class DateValidationPipe implements PipeTransform {
    transform(value: any) {
        if (value === undefined || value === null) {
            return value;
        }

        // If it's already a Date object, return as is
        if (value instanceof Date) {
            return value;
        }

        // If it's a string, try to parse it
        if (typeof value === 'string') {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                throw new BadRequestException(`Invalid date format: ${value}`);
            }
            return date;
        }

        // If it's a number (timestamp), try to parse it
        if (typeof value === 'number') {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                throw new BadRequestException(`Invalid timestamp: ${value}`);
            }
            return date;
        }

        throw new BadRequestException(`Invalid date value: ${value}`);
    }
} 