'use client';

import React, { useState, useEffect } from 'react';
import {
  Heading,
  Stack,
  Field,
  Input,
  Button,
  Text,
  Box,
  VStack,
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
    <Box
      bg="bg.subtle"
      borderRadius="2xl"
      border="1px solid"
      borderColor="border"
      p={{ base: 4, sm: 6, md: 8 }}
      boxShadow="sm"
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        bg: 'linear-gradient(90deg, blue.500, purple.500)',
        borderRadius: '2xl 2xl 0 0',
      }}
    >
      <VStack align="start" gap={2} mb={{ base: 4, md: 6 }}>
        <Heading
          as="h2"
          size={{ base: 'lg', md: 'xl' }}
          fontWeight="semibold"
          color="fg"
          display="flex"
          alignItems="center"
          gap={3}
        >
          <Box
            w="8px"
            h="8px"
            borderRadius="full"
            bg="colorPalette.solid"
            colorPalette="purple"
          />
          Website Settings
        </Heading>
        <Text
          fontSize={{ base: 'sm', md: 'md' }}
          color="fg.muted"
          lineHeight="relaxed"
        >
          Configure your website&apos;s basic information and appearance
        </Text>
      </VStack>

      <form onSubmit={handleSubmit}>
        <Stack gap={{ base: 4, md: 6 }}>
          <Field.Root>
            <Field.Label
              htmlFor="name"
              fontSize="sm"
              fontWeight="semibold"
              color="fg"
              mb={2}
            >
              Website Name
            </Field.Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your website name"
              maxLength={50}
              required
              bg="bg.canvas"
              borderColor="border"
              borderWidth="2px"
              borderRadius="lg"
              fontSize={{ base: 'sm', md: 'md' }}
              color="fg"
              _placeholder={{ color: 'fg.muted' }}
              _focus={{
                borderColor: 'colorPalette.solid',
                colorPalette: 'blue',
                boxShadow: '0 0 0 3px colorPalette.subtle',
              }}
              _hover={{
                borderColor: 'border.emphasized',
              }}
            />
            <Field.HelperText
              fontSize={{ base: 'xs', md: 'sm' }}
              color="fg.muted"
              mt={2}
            >
              This name appears in browser tabs and search results. Maximum 50
              characters.
            </Field.HelperText>
          </Field.Root>

          <Button
            type="submit"
            disabled={loading}
            loading={loading}
            colorPalette="blue"
            variant="solid"
            size={{ base: 'md', md: 'lg' }}
            width="full"
            height={{ base: '44px', md: '48px' }}
            borderRadius="lg"
            fontSize={{ base: 'sm', md: 'md' }}
            fontWeight="semibold"
            mt={2}
            _dark={{
              bg: 'colorPalette.solid',
              _hover: { bg: 'colorPalette.emphasized' },
              _disabled: { bg: 'colorPalette.muted' },
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
          fontWeight="medium"
          px={3}
          py={2}
          borderRadius="md"
          bg={message.includes('successfully') ? 'green.subtle' : 'red.subtle'}
          color={message.includes('successfully') ? 'green.fg' : 'red.fg'}
          border="1px solid"
          borderColor={
            message.includes('successfully') ? 'green.border' : 'red.border'
          }
        >
          {message}
        </Text>
      )}
    </Box>
  );
}
