import { describe, expect, it, vi } from 'vitest';

import type { Db } from '../../_types';

import { validateByFieldType } from '../index';
import { invalidItemPartial, validItem } from './mock-data';

vi.spyOn(console, 'warn').mockImplementation(() => {});

describe('validateByFieldType', () => {
	it('should return true for a valid PortfolioPage object', () => {
		const result = validateByFieldType(validItem);
		expect(result).toBe(true);
		expect(console.warn).not.toHaveBeenCalled();
	});

	it('should return false for missing required fields', () => {
		const result = validateByFieldType(invalidItemPartial as Db['PortfolioPage']);
		expect(result).toBe(false);
		expect(console.warn).toHaveBeenCalled();
		expect(console.warn).toHaveBeenCalledWith(
			expect.stringContaining('Item undefined failed type validation:'),
			expect.arrayContaining([
				expect.objectContaining({ message: expect.stringContaining('"id" is required') }),
				expect.objectContaining({ message: expect.stringContaining('imageComponents[0].id') }),
				expect.objectContaining({
					message: expect.stringContaining('imageComponents[0].positions[0].y')
				})
			])
		);
	});
});
