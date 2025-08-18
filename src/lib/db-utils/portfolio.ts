import type { Remapped, Db } from '^types';

export function sanitiseDataDb(data: Db['PortfolioPage'][]): Db['PortfolioPage'][] {
	return data.filter(sanitisePortfolioPageDb).map(({ imageComponents, ...restPage }) => ({
		...restPage,
		imageComponents: imageComponents
			.filter(sanitiseImageComponentDb)
			.map(({ positions, widths, ...restImageComponent }) => ({
				...restImageComponent,
				positions: positions.filter(sanitisePositionDb),
				widths: widths.filter(sanitiseStyleDb)
			}))
	}));
}

function sanitisePortfolioPageDb(data: Db['PortfolioPage']): boolean {
	return (
		typeof data === 'object' &&
		data !== null &&
		!Array.isArray(data) &&
		typeof data.id === 'number' &&
		typeof data.order === 'number' &&
		Array.isArray(data.imageComponents)
	);
}

function sanitiseImageComponentDb(data: Db['PortfolioPage']['imageComponents'][number]): boolean {
	return (
		typeof data === 'object' &&
		data !== null &&
		!Array.isArray(data) &&
		typeof data.id === 'number' &&
		typeof data.order === 'number' &&
		typeof data.layer === 'number' &&
		typeof data.image.image.url === 'string'
	);
}

function sanitisePositionDb(data: Db['Position']): boolean {
	return (
		typeof data === 'object' &&
		data !== null &&
		!Array.isArray(data) &&
		typeof data.id === 'number' &&
		typeof data.aspectRatio === 'number' &&
		typeof data.x === 'number' &&
		typeof data.y === 'number'
	);
}

function sanitiseStyleDb(data: Db['StyleWithSingleValue']): boolean {
	return (
		typeof data === 'object' &&
		data !== null &&
		!Array.isArray(data) &&
		typeof data.id === 'number' &&
		typeof data.aspectRatio === 'number' &&
		typeof data.value === 'number'
	);
}

export function remapDataDb(data: Db['PortfolioPage']): Remapped['PortfolioPage'] {
	const { id, order, imageComponents } = data;

	return {
		id,
		order,
		dynamicImages: imageComponents.map(({ image, id, ...restItem }) => ({
			id,
			url: image.image.url,
			...restItem
		}))
	};
}
