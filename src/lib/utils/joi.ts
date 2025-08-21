import Joi, { type ObjectSchema, type Schema } from 'joi';

function buildSchema<T extends object>(schema: { [K in keyof T]-?: Schema }): ObjectSchema<T> {
	return Joi.object(schema) as ObjectSchema<T>;
}

export { buildSchema };
