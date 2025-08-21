import Joi from 'joi';

import type { DbSchema } from '^db';
import { positionSchema, styleDefaultSchema, textComponentSchema } from '^db/common';

const imageSchema = Joi.object({
	id: Joi.number().required(),
	order: Joi.number().required(),
	layer: Joi.number().required(),
	positions: Joi.array().items(positionSchema).min(1).required(),
	widths: Joi.array().items(styleDefaultSchema).min(1).required(),
	image: Joi.object({
		image: Joi.object({
			url: Joi.string().required()
		}).required()
	}).unknown(true),
	shopHomeStatus: Joi.string().optional()
}).options({ stripUnknown: true });

const productSchema = Joi.object({
	id: Joi.number().required(),
	images: Joi.array().items(imageSchema).min(1).required(),
	shopHomeImgPositions: Joi.array().items(positionSchema).min(1).required(),
	shopHomeImgWidths: Joi.array().items(styleDefaultSchema).min(1).required(),
	shopifyId: Joi.string().required(),
	addToCartButton: textComponentSchema,
	productDiscount: textComponentSchema,
	productViewDescription: textComponentSchema,
	productViewPrice: textComponentSchema,
	productViewTitle: textComponentSchema,
	textAlignmentPosition: Joi.array().items(positionSchema).optional()
}).options({ stripUnknown: true });

function deepValidate(item: DbSchema['Product']): boolean {
	const { error } = productSchema.validate(item, {
		abortEarly: false,
		allowUnknown: true,
		convert: false
	});

	if (error) {
		console.warn(`Item ${item.id} failed type validation:`, error.details);
	}

	return !error;
}

export { deepValidate };
