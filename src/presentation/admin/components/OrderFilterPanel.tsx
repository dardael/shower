'use client';

import { memo } from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  Input,
  Button,
  Flex,
  Badge,
  NativeSelect,
} from '@chakra-ui/react';
import { FiRotateCcw } from 'react-icons/fi';
import {
  OrderStatus,
  getOrderStatusLabel,
} from '@/domain/order/value-objects/OrderStatus';
import type { OrderFilterState } from '@/domain/order/value-objects/OrderFilterState';
import type {
  OrderSortState,
  SortField,
  SortDirection,
} from '@/domain/order/value-objects/OrderSortState';
import { useDynamicTheme } from '@/presentation/shared/DynamicThemeProvider';

// Simple interfaces for props - matches API response structure
interface ProductOption {
  id: string;
  name: string;
}

interface CategoryOption {
  id: string;
  name: string;
}

interface OrderFilterPanelProps {
  filterState: OrderFilterState;
  sortState: OrderSortState;
  onStatusToggle: (status: OrderStatus) => void;
  onCustomerNameChange: (name: string) => void;
  onProductChange: (productId: string | null) => void;
  onCategoryChange: (categoryId: string | null) => void;
  onSortChange: (field: SortField) => void;
  onReset: () => void;
  filteredCount: number;
  totalCount: number;
  products: ProductOption[];
  categories: CategoryOption[];
}

const STATUS_COLORS: Record<
  OrderStatus,
  { bg: string; color: string; borderColor: string }
> = {
  [OrderStatus.NEW]: {
    bg: 'blue.500',
    color: 'white',
    borderColor: 'blue.500',
  },
  [OrderStatus.CONFIRMED]: {
    bg: 'orange.500',
    color: 'white',
    borderColor: 'orange.500',
  },
  [OrderStatus.COMPLETED]: {
    bg: 'green.500',
    color: 'white',
    borderColor: 'green.500',
  },
};

function OrderFilterPanel({
  filterState,
  sortState,
  onStatusToggle,
  onCustomerNameChange,
  onProductChange,
  onCategoryChange,
  onSortChange,
  onReset,
  filteredCount,
  totalCount,
  products,
  categories,
}: OrderFilterPanelProps): React.JSX.Element {
  const { themeColor } = useDynamicTheme();
  const allStatuses = Object.values(OrderStatus);

  return (
    <Box
      bg="white"
      borderRadius="lg"
      borderWidth={1}
      borderColor="gray.200"
      p={4}
      mb={4}
      _dark={{ bg: 'gray.800', borderColor: 'gray.600' }}
    >
      <VStack gap={4} align="stretch">
        {/* Status Filter */}
        <Box>
          <Text
            fontWeight="semibold"
            mb={2}
            fontSize="sm"
            color="gray.600"
            _dark={{ color: 'gray.400' }}
          >
            Filtrer par statut
          </Text>
          <HStack gap={2} flexWrap="wrap">
            {allStatuses.map((status) => {
              const isActive = filterState.statuses.includes(status);
              const config = STATUS_COLORS[status];
              return (
                <Button
                  key={status}
                  size="sm"
                  bg={isActive ? config.bg : 'transparent'}
                  color={isActive ? config.color : config.borderColor}
                  borderWidth={1}
                  borderColor={config.borderColor}
                  _hover={{
                    bg: isActive
                      ? config.bg
                      : `${config.borderColor.replace('.500', '.50')}`,
                    opacity: isActive ? 0.9 : 1,
                  }}
                  onClick={() => onStatusToggle(status)}
                >
                  {getOrderStatusLabel(status)}
                </Button>
              );
            })}
          </HStack>
        </Box>

        {/* Customer Name Search */}
        <Box>
          <Text
            fontWeight="semibold"
            mb={2}
            fontSize="sm"
            color="gray.600"
            _dark={{ color: 'gray.400' }}
          >
            Rechercher par nom
          </Text>
          <Input
            placeholder="Nom ou prénom du client..."
            value={filterState.customerName}
            onChange={(e) => onCustomerNameChange(e.target.value)}
            size="sm"
            maxW="300px"
          />
        </Box>

        {/* Product and Category Filters */}
        <HStack gap={4} flexWrap="wrap">
          <Box>
            <Text
              fontWeight="semibold"
              mb={2}
              fontSize="sm"
              color="gray.600"
              _dark={{ color: 'gray.400' }}
            >
              Filtrer par produit
            </Text>
            <NativeSelect.Root size="sm" width="200px">
              <NativeSelect.Field
                value={filterState.productId || ''}
                onChange={(e) => onProductChange(e.target.value || null)}
              >
                <option value="">Tous les produits</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Box>

          <Box>
            <Text
              fontWeight="semibold"
              mb={2}
              fontSize="sm"
              color="gray.600"
              _dark={{ color: 'gray.400' }}
            >
              Filtrer par catégorie
            </Text>
            <NativeSelect.Root size="sm" width="200px">
              <NativeSelect.Field
                value={filterState.categoryId || ''}
                onChange={(e) => onCategoryChange(e.target.value || null)}
              >
                <option value="">Toutes les catégories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Box>
        </HStack>

        {/* Sort Controls */}
        <Box>
          <Text
            fontWeight="semibold"
            mb={2}
            fontSize="sm"
            color="gray.600"
            _dark={{ color: 'gray.400' }}
          >
            Trier par
          </Text>
          <HStack gap={2} flexWrap="wrap">
            <SortButton
              label="Date"
              field="date"
              currentField={sortState.field}
              direction={sortState.direction}
              onClick={onSortChange}
              themeColor={themeColor}
            />
            <SortButton
              label="Nom"
              field="customerName"
              currentField={sortState.field}
              direction={sortState.direction}
              onClick={onSortChange}
              themeColor={themeColor}
            />
            <SortButton
              label="Statut"
              field="status"
              currentField={sortState.field}
              direction={sortState.direction}
              onClick={onSortChange}
              themeColor={themeColor}
            />
          </HStack>
        </Box>

        {/* Results Count and Reset */}
        <Flex
          justify="space-between"
          align="center"
          pt={2}
          borderTopWidth={1}
          borderColor="gray.200"
          _dark={{ borderColor: 'gray.600' }}
        >
          <HStack gap={2}>
            <Badge colorPalette={themeColor} variant="solid" px={2} py={1}>
              {filteredCount} / {totalCount} commande
              {filteredCount !== 1 ? 's' : ''}
            </Badge>
          </HStack>
          <Button
            size="sm"
            variant="ghost"
            colorPalette="gray"
            onClick={onReset}
          >
            <FiRotateCcw />
            Réinitialiser
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
}

interface SortButtonProps {
  label: string;
  field: SortField;
  currentField: SortField;
  direction: SortDirection;
  onClick: (field: SortField) => void;
  themeColor: string;
}

function SortButton({
  label,
  field,
  currentField,
  direction,
  onClick,
  themeColor,
}: SortButtonProps): React.JSX.Element {
  const isActive = currentField === field;
  const arrow = isActive ? (direction === 'asc' ? ' ↑' : ' ↓') : '';

  const handleClick = (): void => {
    onClick(field);
  };

  return (
    <Button
      size="sm"
      variant={isActive ? 'solid' : 'outline'}
      colorPalette={isActive ? themeColor : 'gray'}
      onClick={handleClick}
    >
      {label}
      {arrow}
    </Button>
  );
}

export default memo(OrderFilterPanel);
