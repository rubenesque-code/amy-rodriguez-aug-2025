import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { DbSchema } from '^db/~types';
import { schema } from '../joi-schema';
import { itemValid } from './mock-data';
import { produce } from 'immer';
import type { MakeOptional, MakeOptionalAtPath } from '^lib/types';

function validate(item: DbSchema['Portfolio']) {
	const { error, value } = schema.validate(item, {
		abortEarly: false,
		allowUnknown: true,
		convert: false
	});

	if (error) {
		console.warn(`Item ${item.id} failed type validation:`, error.details);
	}

	return { isValid: !error, value };
}

vi.spyOn(console, 'warn').mockImplementation(() => {});

describe('validate function', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should validate a correct portfolio item', () => {
		const item = itemValid;

		const result = validate(item as DbSchema['Portfolio']);

		expect(result.isValid).toBe(true);
		expect(result.value).toStrictEqual(item);
	});

	it('should fail validation when id is missing', () => {
		const item = produce(itemValid as MakeOptional<DbSchema['Portfolio'], 'id'>, (draft) => {
			delete draft['id'];
		}) as DbSchema['Portfolio'];

		const result = validate(item);

		expect(result.isValid).toBe(false);
	});

	it('should fail validation when order is missing', () => {
		const item = produce(itemValid as MakeOptional<DbSchema['Portfolio'], 'order'>, (draft) => {
			delete draft['order'];
		}) as DbSchema['Portfolio'];

		const result = validate(item as DbSchema['Portfolio']);
		expect(result.isValid).toBe(false);
	});

	it('should fail validation when imageComponents is empty', () => {
		const item = produce(itemValid, (draft) => {
			draft.imageComponents = [];
		});

		const result = validate(item as unknown as DbSchema['Portfolio']);
		expect(result.isValid).toBe(false);
	});

	it('should fail validation when imageComponents has invalid data', () => {
		const item = produce(itemValid, (draft) => {
			draft.imageComponents[0].id = 'abc' as unknown as number;
		}) as DbSchema['Portfolio'];

		const result = validate(item);

		expect(result.isValid).toBe(false);
	});

	it('should fail validation when imageComponents is missing url', () => {
		const item = produce(
			itemValid as MakeOptionalAtPath<
				DbSchema['Portfolio'],
				'imageComponents.number.image.image.url'
			>,
			(draft) => {
				delete draft.imageComponents[0].image.image.url;
			}
		) as DbSchema['Portfolio'];

		const result = validate(item);

		expect(result.isValid).toBe(false);
		expect(result.value.imageComponents[0].image.image.url).toBe(undefined);
	});

	/*
	it('should fail validation when positions is empty', () => {
		const item = {
			id: 1,
			order: 1,
			imageComponents: [
				{
					id: 1,
					layer: 1,
					order: 1,
					image: {
						image: {
							url: 'https://example.com/image.jpg'
						}
					},
					positions: [], // Empty positions
					widths: [{ id: 1, aspectRatio: 1.5, value: 300 }]
				}
			]
		};

		const result = validate(item as unknown as DbSchema['Portfolio']);
		expect(result.isValid).toBe(false);
	});

	it('should fail validation when positions has invalid data', () => {
		const item = {
			id: 1,
			order: 1,
			imageComponents: [
				{
					id: 1,
					layer: 1,
					order: 1,
					image: {
						image: {
							url: 'https://example.com/image.jpg'
						}
					},
					positions: [
						{ id: 1, aspectRatio: 'invalid', x: 100, y: 200 } // Invalid aspectRatio
					],
					widths: [{ id: 1, aspectRatio: 1.5, value: 300 }]
				}
			]
		};

		const result = validate(item as unknown as DbSchema['Portfolio']);
		expect(result.isValid).toBe(false);
	});

	// Invalid widths
	it('should fail validation when widths is empty', () => {
		const item = {
			id: 1,
			order: 1,
			imageComponents: [
				{
					id: 1,
					layer: 1,
					order: 1,
					image: {
						image: {
							url: 'https://example.com/image.jpg'
						}
					},
					positions: [{ id: 1, aspectRatio: 1.5, x: 100, y: 200 }],
					widths: [] // Empty widths
				}
			]
		};

		const result = validate(item as unknown as DbSchema['Portfolio']);
		expect(result.isValid).toBe(false);
	});

	it('should fail validation when widths has invalid data', () => {
		const item = {
			id: 1,
			order: 1,
			imageComponents: [
				{
					id: 1,
					layer: 1,
					order: 1,
					image: {
						image: {
							url: 'https://example.com/image.jpg'
						}
					},
					positions: [{ id: 1, aspectRatio: 1.5, x: 100, y: 200 }],
					widths: [
						{ id: 1, aspectRatio: 1.5, value: 'invalid' } // Invalid value
					]
				}
			]
		};

		const result = validate(item as unknown as DbSchema['Portfolio']);
		expect(result.isValid).toBe(false);
	});

	// Allow unknown fields
	it('should allow unknown fields in the input', () => {
		const item = {
			id: 1,
			order: 1,
			unknownField: 'something', // Unknown field
			imageComponents: [
				{
					id: 1,
					layer: 1,
					order: 1,
					image: {
						image: {
							url: 'https://example.com/image.jpg'
						}
					},
					positions: [{ id: 1, aspectRatio: 1.5, x: 100, y: 200 }],
					widths: [{ id: 1, aspectRatio: 1.5, value: 300 }]
				}
			]
		};

		const result = validate(item as unknown as DbSchema['Portfolio']);
		expect(result.isValid).toBe(true);
		expect(result.value).toEqual(item);
	}); */
});
