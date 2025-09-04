import type { Portfolio } from './portfolio';
import type { ProductProcessed, ProductRaw } from './product';
import type { StyleDefault, TextComponent, Position } from './common';

type DbSchema = {
	Portfolio: Portfolio;
	ProductRaw: ProductRaw;
	ProductProcessed: ProductProcessed;
	StyleDefault: StyleDefault;
	TextComponent: TextComponent;
	Position: Position;
};

export type { DbSchema };
