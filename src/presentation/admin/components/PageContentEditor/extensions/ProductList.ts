import { Node, mergeAttributes } from '@tiptap/core';
import { DEFAULT_PRODUCT_LIST_CONFIG } from '@/domain/product/types/ProductListConfig';

export interface ProductListOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    productList: {
      /**
       * Insert a product list block at current cursor position
       */
      insertProductList: () => ReturnType;
      /**
       * Update category filter for selected product list
       */
      updateProductListCategories: (categoryIds: string[] | null) => ReturnType;
      /**
       * Remove the selected product list node
       */
      removeProductList: () => ReturnType;
    };
  }
}

export const ProductList = Node.create<ProductListOptions>({
  name: 'productList',

  group: 'block',

  atom: true,

  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      categoryIds: {
        default: DEFAULT_PRODUCT_LIST_CONFIG.categoryIds,
        parseHTML: (element) => {
          const value = element.getAttribute('data-category-ids');
          if (!value || value === '') {
            return null;
          }
          return value.split(',').filter((id) => id.trim() !== '');
        },
        renderHTML: (attributes) => {
          const categoryIds = attributes.categoryIds;
          if (
            !categoryIds ||
            !Array.isArray(categoryIds) ||
            categoryIds.length === 0
          ) {
            return {};
          }
          return { 'data-category-ids': categoryIds.join(',') };
        },
      },
      layout: {
        default: DEFAULT_PRODUCT_LIST_CONFIG.layout,
        parseHTML: (element) =>
          element.getAttribute('data-layout') ||
          DEFAULT_PRODUCT_LIST_CONFIG.layout,
        renderHTML: (attributes) => ({
          'data-layout': attributes.layout,
        }),
      },
      sortBy: {
        default: DEFAULT_PRODUCT_LIST_CONFIG.sortBy,
        parseHTML: (element) =>
          element.getAttribute('data-sort-by') ||
          DEFAULT_PRODUCT_LIST_CONFIG.sortBy,
        renderHTML: (attributes) => ({
          'data-sort-by': attributes.sortBy,
        }),
      },
      showName: {
        default: DEFAULT_PRODUCT_LIST_CONFIG.showName,
        parseHTML: (element) =>
          element.getAttribute('data-show-name') !== 'false',
        renderHTML: (attributes) => ({
          'data-show-name': String(attributes.showName),
        }),
      },
      showDescription: {
        default: DEFAULT_PRODUCT_LIST_CONFIG.showDescription,
        parseHTML: (element) =>
          element.getAttribute('data-show-description') !== 'false',
        renderHTML: (attributes) => ({
          'data-show-description': String(attributes.showDescription),
        }),
      },
      showPrice: {
        default: DEFAULT_PRODUCT_LIST_CONFIG.showPrice,
        parseHTML: (element) =>
          element.getAttribute('data-show-price') !== 'false',
        renderHTML: (attributes) => ({
          'data-show-price': String(attributes.showPrice),
        }),
      },
      showImage: {
        default: DEFAULT_PRODUCT_LIST_CONFIG.showImage,
        parseHTML: (element) =>
          element.getAttribute('data-show-image') !== 'false',
        renderHTML: (attributes) => ({
          'data-show-image': String(attributes.showImage),
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div.product-list',
      },
    ];
  },

  renderHTML({ node }) {
    const {
      categoryIds,
      layout,
      sortBy,
      showName,
      showDescription,
      showPrice,
      showImage,
    } = node.attrs;

    const dataAttrs: Record<string, string> = {
      class: 'product-list',
      'data-layout': layout,
      'data-sort-by': sortBy,
      'data-show-name': String(showName),
      'data-show-description': String(showDescription),
      'data-show-price': String(showPrice),
      'data-show-image': String(showImage),
    };

    if (categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0) {
      dataAttrs['data-category-ids'] = categoryIds.join(',');
    }

    const attrs = mergeAttributes(this.options.HTMLAttributes, dataAttrs);

    // Render placeholder content for editor preview
    const layoutLabel = layout === 'grid' ? 'Grid' : 'List';
    const categoryLabel =
      categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0
        ? `filtered by ${categoryIds.length} ${categoryIds.length === 1 ? 'category' : 'categories'}`
        : 'all categories';

    return [
      'div',
      attrs,
      [
        'div',
        { class: 'product-list-placeholder' },
        `Products (${layoutLabel} - ${categoryLabel})`,
      ],
    ];
  },

  addCommands() {
    return {
      insertProductList:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              categoryIds: DEFAULT_PRODUCT_LIST_CONFIG.categoryIds,
              layout: DEFAULT_PRODUCT_LIST_CONFIG.layout,
              sortBy: DEFAULT_PRODUCT_LIST_CONFIG.sortBy,
              showName: DEFAULT_PRODUCT_LIST_CONFIG.showName,
              showDescription: DEFAULT_PRODUCT_LIST_CONFIG.showDescription,
              showPrice: DEFAULT_PRODUCT_LIST_CONFIG.showPrice,
              showImage: DEFAULT_PRODUCT_LIST_CONFIG.showImage,
            },
          });
        },

      updateProductListCategories:
        (categoryIds: string[] | null) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { categoryIds });
        },

      removeProductList:
        () =>
        ({ commands }) => {
          return commands.deleteSelection();
        },
    };
  },
});

export default ProductList;
