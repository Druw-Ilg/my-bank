// Calculate mortgage
export function mortgageCalcul(principal, rate, period) {
	const MONTHS_IN_YEAR = 12;
	const PERCENT = 100;
	const ratePerMonths = parseInt(rate) / PERCENT / MONTHS_IN_YEAR;

	const mortgage =
		(principal *
			ratePerMonths *
			Math.pow(1 + ratePerMonths, period * MONTHS_IN_YEAR)) /
		(Math.pow(1 + ratePerMonths, period * MONTHS_IN_YEAR) - 1);

	return mortgage.toFixed(2);
}
