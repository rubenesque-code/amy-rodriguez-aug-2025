import type { DbSchema } from '^db';
import type { SiteSchema } from '^types';

function transformDbDataToSiteSchema(item: DbSchema['Portfolio']): SiteSchema['Portfolio'] {
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

function compareByOrderThenId(a: SiteSchema['Portfolio'], b: SiteSchema['Portfolio']): number {
	if (a.order !== b.order) {
		return a.order - b.order;
	}
	return a.id.localeCompare(b.id);
}

export { transformDbDataToSiteSchema, compareByOrderThenId };
