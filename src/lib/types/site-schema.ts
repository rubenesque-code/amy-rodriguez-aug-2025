type SiteSchema = {
	Portfolio: Portfolio;
};

export type { SiteSchema };

interface Portfolio {
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
