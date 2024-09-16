import { intlFormatDistance } from 'date-fns';
import { type Numbers } from "web3-types";
import { fromWei } from "web3-utils";

export function formatDuration(value: number): string {
	return intlFormatDistance(value, 0);
}

export function formatWei(number: Numbers, unit: number, fractionDigits: number = 4): string {
	const value = fromWei(number, unit);
	const [integerPart, fractionalValue = ""] = value.split('.');

	return integerPart + '.' + fractionalValue.padEnd(fractionDigits, '0').substring(0, fractionDigits);
}
