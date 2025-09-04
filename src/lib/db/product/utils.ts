import { productSchema } from './joi-schema';

import type { DbSchema } from '^db/~types';

function sanitiseProduct(item: DbSchema['ProductRaw']): null | DbSchema['ProductProcessed'] {
	const { error, value } = productSchema.validate(item, {
		abortEarly: false,
		convert: false
	});

	if (error) {
		console.warn(`Item ${item.id} failed type validation:`, error.details);

		return null;
	}

	return value as DbSchema['ProductProcessed'];
}

export { sanitiseProduct };
