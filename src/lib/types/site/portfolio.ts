import type { DynamicImage } from './_common';

export interface PortfolioPage {
	id: string;
	imageComponents: DynamicImage[];
	order: number;
}
