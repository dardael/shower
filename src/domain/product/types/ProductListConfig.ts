/**
 * Layout options for the product list display.
 */
export type ProductListLayout = 'grid' | 'list';

/**
 * Sort options for the product list.
 */
export type ProductListSortBy = 'displayOrder' | 'name' | 'price' | 'createdAt';

/**
 * Labels for layout options.
 */
export const PRODUCT_LIST_LAYOUT_LABELS: Record<ProductListLayout, string> = {
  grid: 'Grid',
  list: 'List',
};

/**
 * Labels for sort options.
 */
export const PRODUCT_LIST_SORT_BY_LABELS: Record<ProductListSortBy, string> = {
  displayOrder: 'Order',
  name: 'Name',
  price: 'Price',
  createdAt: 'Date',
};

/**
 * Configuration for a ProductList node embedded in page content.
 * Stored as data attributes in the HTML representation.
 */
export interface ProductListConfig {
  /**
   * Category IDs to filter products by.
   * Null or empty array means show all products.
   */
  readonly categoryIds: string[] | null;

  /**
   * Layout style for product display.
   */
  readonly layout: ProductListLayout;

  /**
   * Sort order for products.
   */
  readonly sortBy: ProductListSortBy;

  /**
   * Whether to show product name.
   */
  readonly showName: boolean;

  /**
   * Whether to show product description.
   */
  readonly showDescription: boolean;

  /**
   * Whether to show product price.
   */
  readonly showPrice: boolean;

  /**
   * Whether to show product image.
   */
  readonly showImage: boolean;

  /**
   * Maximum number of products to display. Null means no limit.
   */
  readonly maxProducts: number | null;
}

/**
 * Default configuration for new ProductList nodes.
 */
export const DEFAULT_PRODUCT_LIST_CONFIG: ProductListConfig = {
  categoryIds: null,
  layout: 'grid',
  sortBy: 'displayOrder',
  showName: true,
  showDescription: true,
  showPrice: true,
  showImage: true,
  maxProducts: null,
};

/**
 * DTO for public API response - excludes internal fields.
 */
export interface PublicProductDTO {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly imageUrl: string | null;
}
