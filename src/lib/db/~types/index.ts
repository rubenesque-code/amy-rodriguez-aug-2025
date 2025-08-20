import type { Portfolio } from './portfolio';
import type { Product } from './product';

type DbSchema = {
	Portfolio: Portfolio;
	Product: Product;
};

export type { DbSchema };
