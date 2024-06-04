import { intlFormatDistance } from 'date-fns';

export function formatDuration(value: number): string {
	return intlFormatDistance(value * 1000, 0);
}
