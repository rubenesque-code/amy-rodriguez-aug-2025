import { beforeEach, describe, expect, it, vi } from 'vitest';
import { produce } from 'immer';

import type { DbSchema } from '^db/~types';
import { schema } from '../joi-schema';
import { imageComponentValid, itemValid } from './mock-data';
import type { MakeOptional, MakeOptionalAtPath } from '^lib/types';

// TODO
// seperate out image component tests? make explicit referring to when only one image component
// - descripe 'shallow fields'...

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
		const result = validate(itemValid);

		expect(result.isValid).toBe(true);
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

	it('should fail validation when positions is empty', () => {
		const item = produce(itemValid, (draft) => {
			draft.imageComponents[0].positions = [];
		}) as DbSchema['Portfolio'];

		const result = validate(item);

		expect(result.isValid).toBe(false);
	});

	it('should fail validation when widths is empty', () => {
		const item = produce(itemValid, (draft) => {
			draft.imageComponents[0].widths = [];
		}) as DbSchema['Portfolio'];

		const result = validate(item);

		expect(result.isValid).toBe(false);
	});

	it('should pass validation when at least 1 valid image component and invalid image component(s)', () => {
		const imageComponentInvalid = produce(imageComponentValid, (draft) => {
			draft.id = 'abc' as unknown as number;
		});
		const item = produce(itemValid, (draft) => {
			draft.imageComponents.push(imageComponentInvalid);
		}) as DbSchema['Portfolio'];

		const result = validate(item);

		expect(result.isValid).toBe(true);
		expect(result.value.imageComponents).toStrictEqual([imageComponentValid]);
	});
});
