import DOMPurify from 'dompurify';
import { produce } from 'immer';

import type { Shopify } from '^shopify/~types';
import { productSchema } from './joi-schema';

function sanitiseProduct(item: Shopify['Product']): null | Shopify['Product'] {
	const { error, value } = productSchema.validate(item, {
		abortEarly: false,
		convert: false
	});

	if (error) {
		console.warn(`Shopify product ${item.id} failed type validation:`, error.details);
		return null;
	}

	return value;
}

function purifyProduct(item: Shopify['Product']): Shopify['Product'] {
	return produce(item, (draft) => {
		draft.descriptionHtml = DOMPurify.sanitize(draft.descriptionHtml);
	});
}

export { purifyProduct, sanitiseProduct };
