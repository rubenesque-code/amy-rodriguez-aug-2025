import type { Portfolio } from './portfolio';
import type { Product } from './product';
import type { StyleDefault, TextComponent, Position } from './common';

type DbSchema = {
	Portfolio: Portfolio;
	Product: Product;
	StyleDefault: StyleDefault;
	TextComponent: TextComponent;
	Position: Position;
};

export type { DbSchema };
