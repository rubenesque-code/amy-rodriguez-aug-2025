import Joi from 'joi';

import { positionsSchema, stylesDefaultSchema } from '^db/common';
import { buildSchema } from '^lib/utils/joi';
import type { DbSchema } from '^db/~types';
import type { MyOmit } from '^lib/types';

const imageComponentSchema = buildSchema<DbSchema['Product']['images'][number]>({
	id: Joi.number().required(),
	layer: Joi.number().required(),
	order: Joi.number().required(),
	image: Joi.object({
		image: Joi.object({
			url: Joi.string().required()
		}).options({ stripUnknown: true })
	}).options({ stripUnknown: true }),
	positions: positionsSchema,
	shopHomeStatus: Joi.string().optional(),
	widths: stylesDefaultSchema
}).options({ stripUnknown: true });

const imageComponentsSchema = Joi.array()
	.custom((value, helpers) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const validImageComponents = (value as any[]).filter((component) => {
			const { error } = imageComponentSchema.validate(component, { convert: false });
			return !error;
		});

		if (validImageComponents.length === 0) {
			return helpers.error('any.invalid', {
				message: 'At least one valid image component required'
			});
		}

		return validImageComponents;
	})
	.required();

const textComponentSchema = buildSchema<DbSchema['TextComponent']>({
	id: Joi.number().required(),
	fontSizes: stylesDefaultSchema,
	fontWeights: stylesDefaultSchema,
	positions: positionsSchema
});

const textComponentsSchema = Joi.array()
	.custom((value) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const validTextComponents = (value as any[]).filter((component) => {
			const { error } = textComponentSchema.validate(component, { convert: false });
			return !error;
		});

		/* 		if (validTextComponents.length === 0) {
			return helpers.error('any.invalid', {
				message: 'At least one valid image component required'
			});
		} */

		return validTextComponents;
	})
	.required();

const productSchema = buildSchema<
	MyOmit<DbSchema['Product'], 'collections' | 'created_at' | 'updated_at'>
>({
	addToCartButton: textComponentsSchema.optional(),
	id: Joi.number().required(),
	images: imageComponentsSchema,
	productDiscount: textComponentsSchema.optional(),
	productViewDescription: textComponentsSchema.optional(),
	productViewPrice: textComponentsSchema.optional(),
	productViewTitle: textComponentsSchema.optional(),
	shopHomeImgPositions: positionsSchema,
	shopHomeImgWidths: stylesDefaultSchema,
	shopifyId: Joi.string().required(),
	textAlignmentPosition: positionsSchema.optional()
}).options({ stripUnknown: true });

export { productSchema };
