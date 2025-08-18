import { describe, expect, it } from 'vitest';

import type { Db } from '^lib/types';
import { remapDbData } from './portfolio';

describe('sum test', () => {
	it('adds 1 + 2 to equal 3', () => {
		expect(1 + 2).toBe(3);
	});
});

describe('remapDbDataForSite', () => {
	it('remaps a basic PortfolioPage correctly', () => {
		const input: Db['PortfolioPage'][] = [
			{
				id: 1,
				order: 5,
				created_at: '2025-01-01',
				updated_at: '2025-01-02',
				imageComponents: [
					{
						id: 10,
						image: {
							id: 100,
							created_at: '2025-01-01',
							updated_at: '2025-01-02',
							image: {
								id: 999,
								name: 'test',
								alternativeText: null,
								caption: null,
								width: 100,
								height: 100,
								formats: {} as unknown,
								hash: 'abc',
								ext: '.jpg',
								mime: 'image/jpeg',
								size: 123,
								url: '/images/test.jpg',
								previewUrl: null,
								provider: 'cloudinary',
								provider_metadata: { public_id: 'xyz', resource_type: 'image' },
								created_at: '2025-01-01',
								updated_at: '2025-01-02'
							}
						},
						order: 1,
						layer: 2,
						positions: [{ id: 1, aspectRatio: 1, x: 0, y: 0 }],
						widths: [{ id: 1, aspectRatio: 1, value: 100 }]
					}
				]
			}
		];

		const result = remapDbData(input);

		expect(result).toEqual([
			{
				id: '1',
				order: 5,
				dynamicImages: [
					{
						id: '10',
						url: '/images/test.jpg',
						order: 1,
						layer: 2,
						positions: [{ id: 1, aspectRatio: 1, x: 0, y: 0 }],
						widths: [{ id: 1, aspectRatio: 1, value: 100 }]
					}
				]
			}
		]);
	});
});
