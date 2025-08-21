import type { MyOmit } from '^lib/types';
import { portfolioSchema } from './joi-schema';
import type { DbSchema } from '^db/~types';

function sanitisePortfolio(
	item: DbSchema['Portfolio']
): null | MyOmit<DbSchema['Portfolio'], 'created_at' | 'updated_at'> {
	const { error, value } = portfolioSchema.validate(item, {
		abortEarly: false,
		convert: false
	});

	if (error) {
		console.warn(`Item ${item.id} failed type validation:`, error.details);
		return null;
	}

	return value;
}

export { sanitisePortfolio };
