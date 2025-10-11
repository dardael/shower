'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Heading,
  Stack,
  Field,
  Input,
  Button,
  Text,
} from '@chakra-ui/react';

interface WebsiteSettingsFormProps {
  initialName: string;
}

export default function WebsiteSettingsForm({
  initialName,
}: WebsiteSettingsFormProps) {
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchWebsiteName = async () => {
    try {
      const response = await fetch('/api/settings/name');
      const data = await response.json();
      if (response.ok) {
        setName(data.name);
      } else {
        console.error('Failed to fetch website name:', data.error);
      }
    } catch (error) {
      console.error('Error fetching website name:', error);
    }
  };

  useEffect(() => {
    fetchWebsiteName();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Website name updated successfully!');
        await fetchWebsiteName();
      } else {
        setMessage(data.error || 'Failed to update website name');
      }
    } catch {
      setMessage('An error occurred while updating the website name');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxW="md"
      mx="auto"
      mt={8}
      p={6}
      bg={{ base: 'white', _dark: 'gray.800' }}
      borderRadius="lg"
      boxShadow="md"
    >
      <Heading
        as="h2"
        size="lg"
        mb={4}
        color={{ base: 'gray.900', _dark: 'white' }}
      >
        Website Settings
      </Heading>
      <form onSubmit={handleSubmit}>
        <Stack gap={4}>
          <Field.Root>
            <Field.Label
              htmlFor="name"
              color={{ base: 'gray.700', _dark: 'gray.300' }}
            >
              Website Name
            </Field.Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter website name"
              maxLength={50}
              required
              bg={{ base: 'white', _dark: 'gray.700' }}
              borderColor={{ base: 'gray.200', _dark: 'gray.600' }}
              _focus={{
                borderColor: { base: 'blue.500', _dark: 'blue.400' },
                boxShadow: {
                  base: '0 0 0 1px blue.500',
                  _dark: '0 0 0 1px blue.400',
                },
              }}
              color={{ base: 'gray.900', _dark: 'white' }}
              _placeholder={{ color: { base: 'gray.400', _dark: 'gray.500' } }}
            />
            <Field.HelperText color={{ base: 'gray.500', _dark: 'gray.400' }}>
              This name will appear in the browser tab. Max 50 characters.
            </Field.HelperText>
          </Field.Root>
          <Button
            type="submit"
            disabled={loading}
            loading={loading}
            colorPalette="indigo"
            w="full"
            _dark={{
              bg: 'indigo.600',
              _hover: { bg: 'indigo.500' },
              _disabled: { bg: 'indigo.800' },
            }}
          >
            {loading ? 'Updating...' : 'Update Website Name'}
          </Button>
        </Stack>
      </form>
      {message && (
        <Text
          mt={4}
          fontSize="sm"
          color={
            message.includes('successfully')
              ? { base: 'green.600', _dark: 'green.400' }
              : { base: 'red.600', _dark: 'red.400' }
          }
        >
          {message}
        </Text>
      )}
    </Container>
  );
}
