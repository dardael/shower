'use client';

import { ClientOnly, IconButton, Skeleton } from '@chakra-ui/react';
import { LuMoon, LuSun } from 'react-icons/lu';
import { useEffect } from 'react';
import { useColorMode } from '@/presentation/shared/components/ui/color-mode';
import { useThemeModeConfig } from '@/presentation/shared/hooks/useThemeModeConfig';

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
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Dark Mode Toggle Component
 *
 * Provides a toggle button for switching between light and dark modes.
 * Respects admin theme mode configuration:
 * - 'user-choice': Shows toggle, allows user to switch
 * - 'force-light': Hides toggle, applies light mode
 * - 'force-dark': Hides toggle, applies dark mode
 */
export default function DarkModeToggle({
  size = 'sm',
  variant = 'ghost',
  'aria-label': ariaLabel,
  className,
}: DarkModeToggleProps) {
  const { colorMode, toggleColorMode, setColorMode } = useColorMode();
  const { shouldShowToggle, isForced, forcedMode, isLoading } =
    useThemeModeConfig();

  // Apply forced mode whenever it changes (including cross-tab updates)
  useEffect(() => {
    if (!isLoading && isForced && forcedMode) {
      setColorMode(forcedMode);
    }
  }, [isLoading, isForced, forcedMode, setColorMode]);

  // While loading, render nothing to prevent flash
  if (isLoading) {
    return null;
  }

  const isDark = colorMode === 'dark';
  const label =
    ariaLabel || (isDark ? 'Switch to light mode' : 'Switch to dark mode');
  const buttonSize =
    size === 'xs' ? '6' : size === 'sm' ? '8' : size === 'md' ? '10' : '12';

  const handleToggle = () => {
    toggleColorMode();
  };

  // Don't render toggle when mode is forced (hide the button)
  if (!shouldShowToggle) {
    return null;
  }

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
