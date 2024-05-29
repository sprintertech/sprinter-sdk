import { intlFormatDistance } from 'date-fns';

export function formatDuration(value: number): string {
	return intlFormatDistance(value / 10000, 0);
}