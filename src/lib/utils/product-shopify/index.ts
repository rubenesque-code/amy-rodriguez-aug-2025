import type { Shopify } from '^shopify/~types';

function mapToSite({ description, id, title, variants }: Shopify['Product']) {
	const {
		availableForSale,
		compareAtPrice: preSalePrice,
		id: variantId,
		price
	} = variants.edges[0].node;

	const variantRemapped = {
		availableForSale,
		preSalePrice: !preSalePrice ? null : parseFloat(preSalePrice.amount.replace('.0', '')),
		variantId,
		price: parseFloat(price.amount.replace('.0', ''))
	};

	return {
		description,
		id,
		title,
		...variantRemapped
	};
}

export { mapToSite };
