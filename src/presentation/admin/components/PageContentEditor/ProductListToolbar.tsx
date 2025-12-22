'use client';

import { useState, useCallback, useEffect } from 'react';
import { Box, HStack, IconButton, Text, Button } from '@chakra-ui/react';
import { FiGrid, FiList, FiTrash2 } from 'react-icons/fi';
import type { Editor } from '@tiptap/react';
import {
  type ProductListLayout,
  type ProductListSortBy,
  DEFAULT_PRODUCT_LIST_CONFIG,
  PRODUCT_LIST_LAYOUT_LABELS,
  PRODUCT_LIST_SORT_BY_LABELS,
} from '@/domain/product/types/ProductListConfig';
import { Tooltip } from '@/presentation/shared/components/ui/tooltip';
import { CategorySelectPopover } from './CategorySelectPopover';

interface ProductListToolbarProps {
  editor: Editor;
  disabled?: boolean;
  productListPos: number;
}

const LAYOUTS: ProductListLayout[] = ['grid', 'list'];
const SORT_OPTIONS: ProductListSortBy[] = [
  'displayOrder',
  'name',
  'price',
  'createdAt',
];

const LAYOUT_ICONS: Record<ProductListLayout, React.ReactNode> = {
  grid: <FiGrid />,
  list: <FiList />,
};

export function ProductListToolbar({
  editor,
  disabled = false,
  productListPos,
}: ProductListToolbarProps): React.ReactElement | null {
  const [layout, setLayout] = useState<ProductListLayout>(
    DEFAULT_PRODUCT_LIST_CONFIG.layout
  );
  const [sortBy, setSortBy] = useState<ProductListSortBy>(
    DEFAULT_PRODUCT_LIST_CONFIG.sortBy
  );
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [showName, setShowName] = useState(
    DEFAULT_PRODUCT_LIST_CONFIG.showName
  );
  const [showDescription, setShowDescription] = useState(
    DEFAULT_PRODUCT_LIST_CONFIG.showDescription
  );
  const [showPrice, setShowPrice] = useState(
    DEFAULT_PRODUCT_LIST_CONFIG.showPrice
  );
  const [showImage, setShowImage] = useState(
    DEFAULT_PRODUCT_LIST_CONFIG.showImage
  );

  // Get current product list attributes from the selected node
  const getNodeAttrs = useCallback((): Record<string, unknown> | null => {
    const node = editor.state.doc.nodeAt(productListPos);
    if (node && node.type.name === 'productList') {
      return node.attrs;
    }
    return null;
  }, [editor, productListPos]);

  // Sync state with node attributes when selection changes
  useEffect(() => {
    const attrs = getNodeAttrs();
    if (attrs) {
      setLayout(
        (attrs.layout as ProductListLayout) ||
          DEFAULT_PRODUCT_LIST_CONFIG.layout
      );
      setSortBy(
        (attrs.sortBy as ProductListSortBy) ||
          DEFAULT_PRODUCT_LIST_CONFIG.sortBy
      );
      const catIds = attrs.categoryIds;
      setCategoryIds(Array.isArray(catIds) ? catIds : []);
      setShowName(attrs.showName !== false);
      setShowDescription(attrs.showDescription !== false);
      setShowPrice(attrs.showPrice !== false);
      setShowImage(attrs.showImage !== false);
    }
  }, [getNodeAttrs, productListPos]);

  const updateProductListAttrs = useCallback(
    (attrs: Record<string, unknown>): void => {
      const { tr } = editor.state;
      const node = editor.state.doc.nodeAt(productListPos);
      if (node) {
        tr.setNodeMarkup(productListPos, undefined, {
          ...node.attrs,
          ...attrs,
        });
        editor.view.dispatch(tr);
      }
    },
    [editor, productListPos]
  );

  const handleLayoutChange = useCallback(
    (newLayout: ProductListLayout): void => {
      setLayout(newLayout);
      updateProductListAttrs({ layout: newLayout });
    },
    [updateProductListAttrs]
  );

  const handleSortByChange = useCallback(
    (newSortBy: ProductListSortBy): void => {
      setSortBy(newSortBy);
      updateProductListAttrs({ sortBy: newSortBy });
    },
    [updateProductListAttrs]
  );

  const handleCategoryIdsChange = useCallback(
    (newCategoryIds: string[]): void => {
      setCategoryIds(newCategoryIds);
      updateProductListAttrs({
        categoryIds: newCategoryIds.length > 0 ? newCategoryIds : null,
      });
    },
    [updateProductListAttrs]
  );

  const handleToggleShowName = useCallback((): void => {
    const newValue = !showName;
    setShowName(newValue);
    updateProductListAttrs({ showName: newValue });
  }, [showName, updateProductListAttrs]);

  const handleToggleShowDescription = useCallback((): void => {
    const newValue = !showDescription;
    setShowDescription(newValue);
    updateProductListAttrs({ showDescription: newValue });
  }, [showDescription, updateProductListAttrs]);

  const handleToggleShowPrice = useCallback((): void => {
    const newValue = !showPrice;
    setShowPrice(newValue);
    updateProductListAttrs({ showPrice: newValue });
  }, [showPrice, updateProductListAttrs]);

  const handleToggleShowImage = useCallback((): void => {
    const newValue = !showImage;
    setShowImage(newValue);
    updateProductListAttrs({ showImage: newValue });
  }, [showImage, updateProductListAttrs]);

  const handleRemoveProductList = useCallback((): void => {
    editor.chain().focus().deleteSelection().run();
  }, [editor]);

  return (
    <Box
      bg="bg.subtle"
      borderRadius="md"
      p={2}
      borderWidth="1px"
      borderColor="border.muted"
    >
      <HStack gap={2} wrap="wrap">
        {/* Layout selector */}
        <HStack gap={1}>
          <Text fontSize="xs" color="fg.muted">
            Disposition :
          </Text>
          {LAYOUTS.map((l) => (
            <Tooltip key={l} content={PRODUCT_LIST_LAYOUT_LABELS[l]}>
              <IconButton
                aria-label={PRODUCT_LIST_LAYOUT_LABELS[l]}
                size="xs"
                variant={layout === l ? 'solid' : 'ghost'}
                onClick={() => handleLayoutChange(l)}
                disabled={disabled}
              >
                {LAYOUT_ICONS[l]}
              </IconButton>
            </Tooltip>
          ))}
        </HStack>

        {/* Sort selector */}
        <HStack gap={1}>
          <Text fontSize="xs" color="fg.muted">
            Tri :
          </Text>
          {SORT_OPTIONS.map((s) => (
            <Button
              key={s}
              size="xs"
              variant={sortBy === s ? 'solid' : 'ghost'}
              onClick={() => handleSortByChange(s)}
              disabled={disabled}
            >
              {PRODUCT_LIST_SORT_BY_LABELS[s]}
            </Button>
          ))}
        </HStack>

        {/* Category filter */}
        <CategorySelectPopover
          selectedCategoryIds={categoryIds}
          onChange={handleCategoryIdsChange}
          disabled={disabled}
        />

        {/* Display options */}
        <HStack gap={1}>
          <Text fontSize="xs" color="fg.muted">
            Afficher :
          </Text>
          <Button
            size="xs"
            variant={showName ? 'solid' : 'ghost'}
            onClick={handleToggleShowName}
            disabled={disabled}
          >
            Nom
          </Button>
          <Button
            size="xs"
            variant={showDescription ? 'solid' : 'ghost'}
            onClick={handleToggleShowDescription}
            disabled={disabled}
          >
            Desc
          </Button>
          <Button
            size="xs"
            variant={showPrice ? 'solid' : 'ghost'}
            onClick={handleToggleShowPrice}
            disabled={disabled}
          >
            Prix
          </Button>
          <Button
            size="xs"
            variant={showImage ? 'solid' : 'ghost'}
            onClick={handleToggleShowImage}
            disabled={disabled}
          >
            Image
          </Button>
        </HStack>

        {/* Remove button */}
        <Tooltip content="Supprimer la liste de produits">
          <IconButton
            aria-label="Supprimer la liste de produits"
            size="xs"
            variant="ghost"
            colorPalette="red"
            onClick={handleRemoveProductList}
            disabled={disabled}
          >
            <FiTrash2 />
          </IconButton>
        </Tooltip>
      </HStack>
    </Box>
  );
}
