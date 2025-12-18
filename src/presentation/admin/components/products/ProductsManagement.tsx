'use client';

import { Box, Heading, Tabs } from '@chakra-ui/react';
import { ProductList } from './ProductList';
import { CategoryList } from './CategoryList';

export function ProductsManagement(): React.ReactElement {
  return (
    <Box>
      <Heading size="lg" mb={6}>
        Products & Categories
      </Heading>

      <Tabs.Root defaultValue="products" variant="enclosed">
        <Tabs.List>
          <Tabs.Trigger value="products">Products</Tabs.Trigger>
          <Tabs.Trigger value="categories">Categories</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="products">
          <Box pt={4}>
            <ProductList />
          </Box>
        </Tabs.Content>

        <Tabs.Content value="categories">
          <Box pt={4}>
            <CategoryList />
          </Box>
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}
