<script module>
	import { onMount } from 'svelte';

	import { shopifyHelper as shopify, shopifyState } from '^lib/stores';
	import { buildSchema } from '^lib/utils/joi';
	import type { Shopify } from '^lib/types/shopify.js';
	import Joi from 'joi';

	// buildSchema doesn't work with non-primary fields
	// purify html
	// descriptionHTML and/or description optional?

	let productShopifySchema = buildSchema<Shopify['Product']>({
		id: Joi.string().required(),
		description: Joi.string().required(),
		descriptionHtml: Joi.string().required(),
		title: Joi.string().required(),
		variants: Joi.object({
			edges: Joi.array()
				.items(
					Joi.object({
						node: Joi.object({
							id: Joi.string().required(),
							availableForSale: Joi.boolean().required(),
							compareAtPrice: Joi.object({ amount: Joi.string().required() })
								.allow(null)
								.optional(),
							price: Joi.object({ amount: Joi.string().required() }).required()
						}).required()
					}).required()
				)
				.min(1)
		}).required()
	});

	function sanitiseProductShopify(item: Shopify['Product']): null | Shopify['Product'] {
		const { error, value } = productShopifySchema.validate(item, {
			abortEarly: false,
			convert: false
		});

		if (error) {
			console.warn(`Item ${item.id} failed type validation:`, error.details);
			return null;
		}

		return value;
	}

	// raw. purify html/strings. remap.
</script>

<script lang="ts">
	let { data } = $props();
	// console.log('data:', data);

	$inspect('SHOPIFY PRODUCTS', shopifyState.products);

	$effect(() => {
		if (!shopifyState.products) {
			return;
		}
		const productsShopifySanitised = shopifyState.products
			?.map(sanitiseProductShopify)
			.filter((p): p is Shopify['Product'] => p !== null);

		console.log('productsShopifySanitised:', productsShopifySanitised);
	});

	onMount(() => {
		shopify.products.fetch();
	});
</script>

{JSON.stringify(data)}
