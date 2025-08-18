import type { Position, StyleWithSingleValue } from '../db/_common';

type Remapped = {
	PortfolioPage: PortfolioPage;
};

export type { Remapped };

interface PortfolioPage {
	id: number;
	order: number;
	dynamicImages: {
		id: number;
		url: string;
		order: number;
		layer: number;
		positions: Position[];
		widths: StyleWithSingleValue[];
	}[];
}
