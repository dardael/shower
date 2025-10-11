import { Container, Heading, Text, VStack } from '@chakra-ui/react';

export default function Home() {
  return (
    <Container maxW="container.lg" py={16}>
      <VStack gap={4} textAlign="center">
        <Heading as="h1" size="2xl">
          Welcome to Shower
        </Heading>
        <Text fontSize="lg">Your showcase website builder.</Text>
      </VStack>
    </Container>
  );
}
