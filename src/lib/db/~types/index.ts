import type { Portfolio } from './portfolio';
import type { Product } from './product';
import type { StyleWithSingleValue, TextComponent, Position } from './common';

type DbSchema = {
	Portfolio: Portfolio;
	Product: Product;
	StyleWithSingleValue: StyleWithSingleValue;
	TextComponent: TextComponent;
	Position: Position;
};

export type { DbSchema };
