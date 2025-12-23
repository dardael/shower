'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Card,
  Accordion,
  Table,
  Button,
  Flex,
  Spinner,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/presentation/shared/utils/formatPrice';
import {
  OrderStatus,
  getOrderStatusLabel,
} from '@/domain/order/value-objects/OrderStatus';
import { useOrdersFilterSort } from '@/presentation/admin/hooks/useOrdersFilterSort';
import OrderFilterPanel from '@/presentation/admin/components/OrderFilterPanel';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface Order {
  id: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  id: string;
  name: string;
  categoryIds: string[];
}

interface Category {
  id: string;
  name: string;
}

interface StatusConfig {
  bg: string;
  color: string;
  hoverBg: string;
  borderColor: string;
}

const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  [OrderStatus.NEW]: {
    bg: 'blue.500',
    color: 'white',
    hoverBg: 'blue.600',
    borderColor: 'blue.500',
  },
  [OrderStatus.CONFIRMED]: {
    bg: 'orange.500',
    color: 'white',
    hoverBg: 'orange.600',
    borderColor: 'orange.500',
  },
  [OrderStatus.COMPLETED]: {
    bg: 'green.500',
    color: 'white',
    hoverBg: 'green.600',
    borderColor: 'green.500',
  },
};

interface StatusButtonProps {
  status: OrderStatus;
  currentStatus: OrderStatus;
  onClick: () => void;
}

function StatusButton({
  status,
  currentStatus,
  onClick,
}: StatusButtonProps): React.JSX.Element {
  const config = STATUS_CONFIG[status];
  const isActive = currentStatus === status;

  return (
    <Button
      size="sm"
      bg={isActive ? config.bg : 'white'}
      color={isActive ? config.color : config.borderColor}
      borderWidth={1}
      borderColor={config.borderColor}
      _hover={{
        bg: isActive
          ? config.hoverBg
          : `${config.borderColor.replace('.500', '.50')}`,
      }}
      onClick={onClick}
    >
      {getOrderStatusLabel(status)}
    </Button>
  );
}

export default function OrdersClient(): React.JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Use filter/sort hook
  const {
    filterState,
    sortState,
    setStatusFilter,
    setCustomerNameFilter,
    setProductFilter,
    setCategoryFilter,
    setSortField,
    resetAll,
    getFilteredAndSortedOrders,
  } = useOrdersFilterSort();

  // Build product category map for filtering
  const productCategoryMap = useMemo(() => {
    const map = new Map<string, string[]>();
    products.forEach((product) => {
      map.set(product.id, product.categoryIds);
    });
    return map;
  }, [products]);

  // Derive filtered and sorted orders
  // Apply filters and sorting to orders
  const filteredOrders = useMemo((): Order[] => {
    // Type assertion needed because hook uses domain Order type while component uses API response type
    // Both have compatible shapes for filtering/sorting purposes
    return getFilteredAndSortedOrders(
      orders as unknown as Parameters<typeof getFilteredAndSortedOrders>[0],
      productCategoryMap
    ) as unknown as Order[];
  }, [orders, productCategoryMap, getFilteredAndSortedOrders]);

  useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        const [ordersResponse, productsResponse, categoriesResponse] =
          await Promise.all([
            fetch('/api/orders'),
            fetch('/api/admin/products'),
            fetch('/api/admin/categories'),
          ]);

        if (ordersResponse.status === 401) {
          router.push('/admin');
          return;
        }

        if (!ordersResponse.ok) {
          throw new Error('Erreur lors du chargement des commandes');
        }

        const ordersData = (await ordersResponse.json()) as Order[];
        setOrders(ordersData);

        if (productsResponse.ok) {
          const productsData = (await productsResponse.json()) as {
            products: Product[];
          };
          setProducts(productsData.products || []);
        }

        if (categoriesResponse.ok) {
          const categoriesData = (await categoriesResponse.json()) as {
            categories: Category[];
          };
          setCategories(categoriesData.categories || []);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Une erreur est survenue'
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [router]);

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus
  ): Promise<void> => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du statut');
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erreur de mise à jour du statut'
      );
    }
  };

  const handleSortChange = (
    field: 'date' | 'customerName' | 'status'
  ): void => {
    setSortField(field);
    // Direction is toggled automatically by the hook when field changes
  };

  const handleReset = (): void => {
    resetAll();
  };

  const handleStatusToggle = (status: OrderStatus): void => {
    const currentStatuses = filterState.statuses;
    if (currentStatuses.includes(status)) {
      setStatusFilter(currentStatuses.filter((s) => s !== status));
    } else {
      setStatusFilter([...currentStatuses, status]);
    }
  };

  if (isLoading) {
    return (
      <Flex
        minH="100vh"
        alignItems="center"
        justifyContent="center"
        bg="gray.50"
      >
        <VStack gap={4}>
          <Spinner size="xl" color="blue.500" />
          <Text color="gray.600">Chargement des commandes...</Text>
        </VStack>
      </Flex>
    );
  }

  if (error) {
    return (
      <Container maxW="container.lg" py={8}>
        <Text color="red.500">{error}</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={6} align="stretch">
        <Heading size="xl">Gestion des commandes</Heading>

        {/* Filter Panel */}
        <OrderFilterPanel
          filterState={filterState}
          sortState={sortState}
          onStatusToggle={handleStatusToggle}
          onCustomerNameChange={setCustomerNameFilter}
          onProductChange={setProductFilter}
          onCategoryChange={setCategoryFilter}
          onSortChange={handleSortChange}
          onReset={handleReset}
          filteredCount={filteredOrders.length}
          totalCount={orders.length}
          products={products}
          categories={categories}
        />

        {filteredOrders.length === 0 ? (
          <Card.Root p={6}>
            <Text textAlign="center" color="gray.500">
              {orders.length === 0
                ? 'Aucune commande pour le moment'
                : 'Aucune commande ne correspond aux filtres sélectionnés'}
            </Text>
          </Card.Root>
        ) : (
          <Accordion.Root multiple>
            {filteredOrders.map((order, index) => {
              const statusConfig = STATUS_CONFIG[order.status];
              return (
                <Accordion.Item key={order.id} value={order.id}>
                  <Accordion.ItemTrigger>
                    <HStack flex={1} justify="space-between" pr={4}>
                      <HStack gap={4}>
                        <Text fontWeight="bold">Commande #{index + 1}</Text>
                        <Text>
                          {order.customerFirstName} {order.customerLastName}
                        </Text>
                      </HStack>
                      <HStack gap={4}>
                        <Text>{formatPrice(order.totalPrice)}</Text>
                        <Badge
                          bg={statusConfig.bg}
                          color={statusConfig.color}
                          px={2}
                          py={1}
                          borderRadius="md"
                        >
                          {getOrderStatusLabel(order.status)}
                        </Badge>
                        <Text fontSize="sm" color="gray.500">
                          {new Date(order.createdAt).toLocaleDateString(
                            'fr-FR'
                          )}
                        </Text>
                      </HStack>
                    </HStack>
                    <Accordion.ItemIndicator />
                  </Accordion.ItemTrigger>
                  <Accordion.ItemContent>
                    <Box p={4}>
                      <VStack gap={4} align="stretch">
                        {/* Customer Info */}
                        <Box>
                          <Heading size="sm" mb={2}>
                            Informations client
                          </Heading>
                          <VStack align="start" gap={1}>
                            <Text>
                              <strong>Nom :</strong> {order.customerLastName}
                            </Text>
                            <Text>
                              <strong>Prénom :</strong>{' '}
                              {order.customerFirstName}
                            </Text>
                            <Text>
                              <strong>Email :</strong> {order.customerEmail}
                            </Text>
                            <Text>
                              <strong>Téléphone :</strong> {order.customerPhone}
                            </Text>
                          </VStack>
                        </Box>

                        {/* Order Items */}
                        <Box>
                          <Heading size="sm" mb={2}>
                            Produits commandés
                          </Heading>
                          <Table.Root size="sm">
                            <Table.Header>
                              <Table.Row>
                                <Table.ColumnHeader>Produit</Table.ColumnHeader>
                                <Table.ColumnHeader>
                                  Quantité
                                </Table.ColumnHeader>
                                <Table.ColumnHeader>
                                  Prix unitaire
                                </Table.ColumnHeader>
                                <Table.ColumnHeader>
                                  Sous-total
                                </Table.ColumnHeader>
                              </Table.Row>
                            </Table.Header>
                            <Table.Body>
                              {order.items.map((item) => (
                                <Table.Row key={item.productId}>
                                  <Table.Cell>{item.productName}</Table.Cell>
                                  <Table.Cell>{item.quantity}</Table.Cell>
                                  <Table.Cell>
                                    {formatPrice(item.unitPrice)}
                                  </Table.Cell>
                                  <Table.Cell>
                                    {formatPrice(
                                      item.quantity * item.unitPrice
                                    )}
                                  </Table.Cell>
                                </Table.Row>
                              ))}
                            </Table.Body>
                          </Table.Root>
                          <Text fontWeight="bold" mt={2} textAlign="right">
                            Total : {formatPrice(order.totalPrice)}
                          </Text>
                        </Box>

                        {/* Status Management */}
                        <Box>
                          <Heading size="sm" mb={2}>
                            Statut de la commande
                          </Heading>
                          <HStack gap={2}>
                            <StatusButton
                              status={OrderStatus.NEW}
                              currentStatus={order.status}
                              onClick={() =>
                                handleStatusChange(order.id, OrderStatus.NEW)
                              }
                            />
                            <StatusButton
                              status={OrderStatus.CONFIRMED}
                              currentStatus={order.status}
                              onClick={() =>
                                handleStatusChange(
                                  order.id,
                                  OrderStatus.CONFIRMED
                                )
                              }
                            />
                            <StatusButton
                              status={OrderStatus.COMPLETED}
                              currentStatus={order.status}
                              onClick={() =>
                                handleStatusChange(
                                  order.id,
                                  OrderStatus.COMPLETED
                                )
                              }
                            />
                          </HStack>
                        </Box>
                      </VStack>
                    </Box>
                  </Accordion.ItemContent>
                </Accordion.Item>
              );
            })}
          </Accordion.Root>
        )}
      </VStack>
    </Container>
  );
}
