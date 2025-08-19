import type { PortfolioPage } from './portfolio-page';
import type { Position, StyleWithSingleValue } from './_common';

export interface Db {
	PortfolioPage: PortfolioPage;
	Position: Position;
	StyleWithSingleValue: StyleWithSingleValue;
}
