import Joi from 'joi';

import { buildSchema } from '^lib/utils/joi';
import { positionsSchema, stylesDefaultSchema } from '^db/common';
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
	.custom((value) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const validImageComponents = (value as any[]).filter((component) => {
			const { error } = imageComponentSchema.validate(component, { convert: false });
			return !error;
		});

		return validImageComponents;
	})
	.required();

const textComponentSchema = buildSchema<DbSchema['TextComponent']>({
	id: Joi.number().required(),
	fontSizes: stylesDefaultSchema,
	fontWeights: stylesDefaultSchema,
	positions: positionsSchema
});

const productSchema = buildSchema<
	MyOmit<DbSchema['Product'], 'collections' | 'created_at' | 'updated_at'>
>({
	addToCartButton: textComponentSchema.allow(null).optional(),
	id: Joi.number().required(),
	images: imageComponentsSchema.min(1),
	productDiscount: textComponentSchema.allow(null).optional(),
	productViewDescription: textComponentSchema.allow(null).optional(),
	productViewPrice: textComponentSchema.allow(null).optional(),
	productViewTitle: textComponentSchema.allow(null).optional(),
	shopHomeImgPositions: positionsSchema.min(1),
	shopHomeImgWidths: stylesDefaultSchema.min(1),
	shopifyId: Joi.string().required(),
	textAlignmentPosition: positionsSchema.allow(null).optional()
}).options({ stripUnknown: true });

export { productSchema };
