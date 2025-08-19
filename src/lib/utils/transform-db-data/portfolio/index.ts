import type { Db } from '^lib/db/_types';
import type { SiteSchema } from '^lib/types';

function mapDbToSiteSchema(item: Db['PortfolioPage']): SiteSchema['PortfolioPage'] {
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

function sortByOrderThenId(items: SiteSchema['PortfolioPage'][]): SiteSchema['PortfolioPage'][] {
	return items.sort((a, b) => {
		if (a.order !== b.order) {
			return a.order - b.order;
		}
		return a.id.localeCompare(b.id);
	});
}

export { mapDbToSiteSchema, sortByOrderThenId };
