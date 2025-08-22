import Joi from 'joi';

import { buildSchema } from '^utils/joi';
import type { Shopify } from '^shopify/~types';

const priceSchema = buildSchema<Shopify['Product']['variants']['edges'][number]['node']['price']>({
	amount: Joi.string().required()
});

const variantSchema = buildSchema<Shopify['Product']['variants']['edges'][number]['node']>({
	id: Joi.string().required(),
	availableForSale: Joi.boolean().required(),
	compareAtPrice: priceSchema.allow(null).optional(),
	price: priceSchema.required()
});

const productSchema = buildSchema<Shopify['Product']>({
	id: Joi.string().required(),
	description: Joi.string().required(),
	descriptionHtml: Joi.string().required(),
	title: Joi.string().required(),
	variants: Joi.object({
		edges: Joi.array()
			.items(
				Joi.object({
					node: variantSchema.required()
				}).required()
			)
			.min(1)
	}).required()
});

export { productSchema };
