import type { Shopify } from '^lib/types';

export const cartCreate = `mutation cartCreate($input: CartInput) {
  cartCreate(input: $input) {
    cart {
      id
      checkoutUrl
    }
    userErrors {
      field
      message
    }
  }
}`;

export interface CartCreateRes {
	cartCreate: {
		cart: Shopify['Cart'];
		userErrors: { field: string; message: string }[];
	};
}

export const cartAddProduct = `mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart {
      id
      checkoutUrl
    }
    userErrors {
      field
      message
    }
  }
}`;

export const getProducts = `query getProducts($first: Int) {
  products(first: $first) {
    edges {
      node {
        id
        description
        descriptionHtml
        title
        variants(first: 1) {
          edges {
            node {
              id
              availableForSale
              price {
                amount
              }
              compareAtPrice {
                amount
              }
            }
          }
        }
      }
    }
  }
}`;

export interface ProductQueryRes {
	products: Products;
}

interface Products {
	edges: Edge[];
}

interface Edge {
	node: Shopify['Product'];
}
