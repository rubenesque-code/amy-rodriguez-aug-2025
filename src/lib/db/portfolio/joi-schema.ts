import Joi from 'joi';

import { positionsSchema, stylesDefaultSchema } from '^db/common';
import { buildSchema } from '^lib/utils/joi';
import type { DbSchema } from '^db/~types';
import type { MyOmit } from '^types';

type ImageComponent = DbSchema['Portfolio']['imageComponents'][number];

const imageComponentSchema = buildSchema<ImageComponent>({
	id: Joi.number().required(),
	layer: Joi.number().required(),
	order: Joi.number().required(),
	image: buildSchema<Pick<ImageComponent['image'], 'image'>>({
		image: buildSchema<Pick<ImageComponent['image']['image'], 'url'>>({
			url: Joi.string().required()
		}).unknown()
	}).unknown(),
	positions: positionsSchema,
	widths: stylesDefaultSchema
}).unknown();

const imageComponentsSchema = Joi.array()
	.custom((value) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const validImageComponents = (value as any[]).filter((component) => {
			const { error } = imageComponentSchema.validate(component, { convert: false });
			return !error;
		});

		/* 		if (validImageComponents.length === 0) {
			return helpers.error('any.invalid', {
				message: 'At least one valid image component required'
			});
		} */

		return validImageComponents;
	})
	.required();

const portfolioSchema = buildSchema<MyOmit<DbSchema['Portfolio'], 'created_at' | 'updated_at'>>({
	id: Joi.number().required(),
	order: Joi.number().required(),
	imageComponents: imageComponentsSchema.min(1)
}).options({ stripUnknown: true });

export { portfolioSchema };
