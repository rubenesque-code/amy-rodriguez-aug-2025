import type { MyOmit } from '^types';
import type { DbSchema } from '^db/~types';
import { productSchema } from './joi-schema';

function sanitiseProduct(
	item: DbSchema['Product']
): null | MyOmit<DbSchema['Product'], 'collections' | 'created_at' | 'updated_at'> {
	const { error, value } = productSchema.validate(item, {
		abortEarly: false,
		convert: false
	});

	if (error) {
		console.warn(`Item ${item.id} failed type validation:`, error.details);
		return null;
	}

	return value;
}

export { sanitiseProduct };
