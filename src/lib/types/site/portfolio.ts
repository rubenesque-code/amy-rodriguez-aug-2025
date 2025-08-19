import type { DynamicImage } from './_common';

export interface PortfolioPage {
	id: string;
	dynamicImages: DynamicImage[];
	order: number;
}
