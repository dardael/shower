'use client';

import React, { useState, useEffect } from 'react';
import { IconButton } from '@chakra-ui/react';

/**
 * Dark Mode Toggle Component
 *
 * This component provides a toggle button for switching between light and dark modes.
 * It uses localStorage to persist the user's preference and falls back to system preference.
 */
export default function DarkModeToggle() {
  const [colorMode, setColorMode] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check localStorage for saved preference
    const savedColorMode = localStorage.getItem('chakra-ui-color-mode') as
      | 'light'
      | 'dark'
      | null;

    if (savedColorMode) {
      setColorMode(savedColorMode);
      document.documentElement.classList.toggle(
        'dark',
        savedColorMode === 'dark'
      );
    } else {
      // Check system preference
      const systemPreference = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      setColorMode(systemPreference);
      document.documentElement.classList.toggle(
        'dark',
        systemPreference === 'dark'
      );
    }
  }, []);

  const toggleColorMode = () => {
    const newColorMode = colorMode === 'light' ? 'dark' : 'light';
    setColorMode(newColorMode);
    localStorage.setItem('chakra-ui-color-mode', newColorMode);
    document.documentElement.classList.toggle('dark', newColorMode === 'dark');
  };

  // Avoid hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <IconButton
        aria-label="Toggle color mode"
        variant="ghost"
        size="sm"
        opacity={0}
      />
    );
  }

  return (
    <IconButton
      aria-label="Toggle color mode"
      onClick={toggleColorMode}
      variant="ghost"
      size="sm"
      _dark={{
        bg: 'gray.700',
        _hover: { bg: 'gray.600' },
      }}
      _light={{
        _hover: { bg: 'gray.100' },
      }}
    >
      {colorMode === 'light' ? '🌙' : '☀️'}
    </IconButton>
  );
}
