import type { Db } from '^lib/db/_types';

interface SchemaType {
	id: string;
	order: number;
	imageComponents: Array<{
		id: string;
		layer: number;
		order: number;
		positions: Array<{
			id: string;
			aspectRatio: number;
			x: number;
			y: number;
		}>;
		url: string;
		widths: Array<{
			id: string;
			aspectRatio: number;
			value: number;
		}>;
	}>;
}

function mapDbToSiteSchema(item: Db['PortfolioPage']): SchemaType {
	return {
		id: crypto.randomUUID(),
		order: item.order,
		imageComponents: item.imageComponents.map(({ image, layer, order, positions, widths }) => ({
			id: crypto.randomUUID(),
			layer,
			order,
			url: image.image.url,
			positions: positions.map((position) => ({
				...position,
				id: crypto.randomUUID()
			})),
			widths: widths.map((width) => ({
				...width,
				id: crypto.randomUUID()
			}))
		}))
	};
}

function sortByOrderThenId(items: SchemaType[]): SchemaType[] {
	return items.sort((a, b) => {
		if (a.order !== b.order) {
			return a.order - b.order;
		}
		return a.id.localeCompare(b.id);
	});
}

export { mapDbToSiteSchema, sortByOrderThenId };
