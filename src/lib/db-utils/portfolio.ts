import type { Remapped, Db } from '^types';

export function remapDbData(data: Db['PortfolioPage'][]): Remapped['PortfolioPage'][] {
	return data.map(({ id, order, imageComponents }) => ({
		id: id.toString(),
		order,
		dynamicImages: imageComponents.map(({ image, id, ...restItem }) => ({
			id: id.toString(),
			url: image.image.url,
			...restItem
		}))
	}));
}
