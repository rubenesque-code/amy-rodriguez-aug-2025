import { beforeEach, describe, expect, it, vi } from 'vitest';
import { produce } from 'immer';

import type { DbSchema } from '^db/~types';
import { portfolioSchema } from '../joi-schema';
import { imageComponentValid, itemValid } from './mock-data';
import type { MakeOptional, MakeOptionalAtPath } from '^lib/types';

// TODO
// seperate out image component tests? make explicit referring to when only one image component
// - descripe 'shallow fields'...

function validate(item: DbSchema['Portfolio']) {
	const { error, value } = portfolioSchema.validate(item, {
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

describe('validate db portfolio function', () => {
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

	it('should fail validation when order is incorrect type', () => {
		const item = produce(itemValid as MakeOptional<DbSchema['Portfolio'], 'order'>, (draft) => {
			draft.order = 'abc' as unknown as number;
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

	it('should fail validation when imageComponents has 1 invalid item only with incorrect type', () => {
		const imageComponentInvalid = produce(imageComponentValid, (draft) => {
			draft.id = 'abc' as unknown as number;
		});
		const item = produce(itemValid, (draft) => {
			draft.imageComponents = [imageComponentInvalid];
		}) as DbSchema['Portfolio'];

		const result = validate(item);

		expect(result.isValid).toBe(false);
	});

	it('should fail validation when imageComponents has 1 invalid item only with missing url', () => {
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
	});

	it('should fail validation when imageComponents has 1 invalid item only with no positions', () => {
		const item = produce(itemValid, (draft) => {
			draft.imageComponents[0].positions = [];
		}) as DbSchema['Portfolio'];

		const result = validate(item);

		expect(result.isValid).toBe(false);
	});

	it('should pass validation with mix of valid and invalid image components', () => {
		const imageComponentInvalid = produce(imageComponentValid, (draft) => {
			draft.id = 'abc' as unknown as number;
		});
		const item = produce(itemValid, (draft) => {
			draft.imageComponents.push(imageComponentInvalid);
			draft.imageComponents.push(imageComponentInvalid);
			draft.imageComponents.push(imageComponentValid);
		}) as DbSchema['Portfolio'];

		const result = validate(item);

		expect(result.isValid).toBe(true);
		expect(result.value.imageComponents).toStrictEqual([imageComponentValid, imageComponentValid]);
	});
});
