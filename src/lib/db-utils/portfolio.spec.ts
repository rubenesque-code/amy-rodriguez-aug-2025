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
			layer: 0,
			order: 1,
			positions: [{ id: 1, aspectRatio: 1.0, x: 0, y: 0 }],
			widths: [{ id: 1, aspectRatio: 1.0, value: 100 }],
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
			}
		}
	]
};

describe('sanitiseDataDb', () => {
	it('keeps valid portfolio pages unchanged', () => {
		const output = sanitiseDataDb([validPage]);
		expect(output).toEqual([validPage]);
	});

	it('filters out invalid portfolio pages', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const invalidPage = { ...validPage, order: 'not-a-number' } as any;
		const output = sanitiseDataDb([validPage, invalidPage]);
		expect(output).toEqual([validPage]);
	});

	it('filters out invalid image components', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const badImageComponent = { ...validPage.imageComponents[0], order: 'wrong' } as any;
		const pageWithBadImage = {
			...validPage,
			imageComponents: [...validPage.imageComponents, badImageComponent]
		};
		const output = sanitiseDataDb([pageWithBadImage]);
		expect(output[0].imageComponents.length).toBe(1);
		expect(output[0].imageComponents[0]).toEqual(validPage.imageComponents[0]);
	});

	it('filters out invalid positions', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const badPosition = { id: 'x', aspectRatio: 1, x: 0, y: 0 } as any;
		const page = {
			...validPage,
			imageComponents: [
				{
					...validPage.imageComponents[0],
					positions: [...validPage.imageComponents[0].positions, badPosition]
				}
			]
		};
		const output = sanitiseDataDb([page]);
		expect(output[0].imageComponents[0].positions.length).toBe(1);
	});

	it('filters out invalid widths', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const badWidth = { id: 1, aspectRatio: 1, value: 'wrong' } as any;
		const page = {
			...validPage,
			imageComponents: [
				{
					...validPage.imageComponents[0],
					widths: [...validPage.imageComponents[0].widths, badWidth]
				}
			]
		};
		const output = sanitiseDataDb([page]);
		expect(output[0].imageComponents[0].widths.length).toBe(1);
	});

	it('handles empty arrays correctly', () => {
		const emptyPage = { ...validPage, imageComponents: [] };
		const output = sanitiseDataDb([emptyPage]);
		expect(output[0].imageComponents).toEqual([]);
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
