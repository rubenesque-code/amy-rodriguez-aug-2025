import { describe, expect, it } from 'vitest';

import type { Db } from '^lib/types';
import { remapDataDb, sanitiseDataDb } from './portfolio';

const validPage: Db['PortfolioPage'] = {
	id: 1,
	order: 10,
	created_at: '2025-01-01',
	updated_at: '2025-01-01',
	imageComponents: [
		{
			id: 100,
			order: 1,
			layer: 0,
			image: {
				id: 200,
				created_at: '2025-01-01',
				updated_at: '2025-01-01',
				image: {
					id: 400,
					name: 'img.jpg',
					alternativeText: null,
					caption: null,
					width: 800,
					height: 600,
					formats: {} as unknown,
					hash: 'hash',
					ext: '.jpg',
					mime: 'image/jpeg',
					size: 123,
					url: 'url.jpg',
					previewUrl: null,
					provider: 'cloudinary',
					provider_metadata: { public_id: 'public', resource_type: 'image' },
					created_at: '2025-01-01',
					updated_at: '2025-01-01'
				}
			},
			positions: [{ id: 1, aspectRatio: 1.0, x: 0, y: 0 }],
			widths: [{ id: 1, aspectRatio: 1.0, value: 100 }]
		}
	]
};

describe('sanitiseDataDb', () => {
	it('keeps valid portfolio pages unchanged', () => {
		const output = sanitiseDataDb([validPage]);
		expect(output).toEqual([validPage]);
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

		const result = input.map(remapDataDb);

		expect(result).toEqual([
			{
				id: 1,
				order: 5,
				dynamicImages: [
					{
						id: 10,
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

	it('returns empty array when given empty array', () => {
		expect([].map(remapDataDb)).toEqual([]);
	});

	it('handles PortfolioPage with no imageComponents', () => {
		const input: Db['PortfolioPage'][] = [
			{ id: 1, order: 1, created_at: '', updated_at: '', imageComponents: [] }
		];

		expect(input.map(remapDataDb)).toEqual([{ id: 1, order: 1, dynamicImages: [] }]);
	});
});
