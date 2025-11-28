'use client';

import { ClientOnly, IconButton, Skeleton } from '@chakra-ui/react';
import { LuMoon, LuSun } from 'react-icons/lu';
import { useColorMode } from '@/presentation/shared/components/ui/color-mode';
import { ThemeMode } from '@/domain/settings/value-objects/ThemeMode';

/**
 * Dark Mode Toggle Component Props
 */
interface DarkModeToggleProps {
  /**
   * Size of the toggle button
   * @default 'sm'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg';

  /**
   * Visual variant of the toggle button
   * @default 'ghost'
   */
  variant?: 'solid' | 'subtle' | 'outline' | 'ghost';

  /**
   * Custom aria-label for accessibility
   */
  'aria-label'?: string;

  /**
   * Callback when theme changes
   */
  onThemeChange?: (theme: ThemeMode) => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Dark Mode Toggle Component
 *
 * Provides a toggle button for switching between light and dark modes.
 * Uses next-themes directly for reliable theme switching.
 * Follows Chakra UI v3 component patterns with accessibility support.
 */
export default function DarkModeToggle({
  size = 'sm',
  variant = 'ghost',
  'aria-label': ariaLabel,
  onThemeChange,
  className,
}: DarkModeToggleProps) {
  const { colorMode, toggleColorMode } = useColorMode();

  const isDark = colorMode === 'dark';
  const label =
    ariaLabel || (isDark ? 'Switch to light mode' : 'Switch to dark mode');
  const buttonSize =
    size === 'xs' ? '6' : size === 'sm' ? '8' : size === 'md' ? '10' : '12';

  const handleToggle = () => {
    const newTheme = isDark ? ThemeMode.LIGHT : ThemeMode.DARK;
    toggleColorMode();
    onThemeChange?.(newTheme);
  };

  return (
    <ClientOnly fallback={<Skeleton boxSize={buttonSize} />}>
      <IconButton
        onClick={handleToggle}
        aria-label={label}
        title={label}
        variant={variant}
        size={size}
        className={className}
        boxSize={buttonSize}
        role="switch"
        aria-checked={isDark}
        color={isDark ? 'white' : 'black'}
        _hover={{
          bg: 'bg.muted',
          borderColor: 'border.emphasized',
        }}
        _focusVisible={{
          ring: '2px',
          ringColor: 'border.emphasized',
          ringOffset: '2px',
        }}
      >
        {isDark ? <LuSun /> : <LuMoon />}
      </IconButton>
    </ClientOnly>
  );
}
