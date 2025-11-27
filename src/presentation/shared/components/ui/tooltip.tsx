import { Tooltip as ChakraTooltip } from '@chakra-ui/react';
import * as React from 'react';

export interface TooltipProps {
  showArrow?: boolean;
  positioning?: ChakraTooltip.RootProps['positioning'];
  content: React.ReactNode;
  disabled?: boolean;
  children: React.ReactNode;
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(props, ref) {
    const {
      showArrow = false,
      positioning,
      content,
      disabled,
      children,
    } = props;

    if (disabled) return <>{children}</>;

    return (
      <ChakraTooltip.Root positioning={positioning}>
        <ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
        <ChakraTooltip.Positioner>
          <ChakraTooltip.Content ref={ref}>
            {showArrow && <ChakraTooltip.Arrow />}
            {content}
          </ChakraTooltip.Content>
        </ChakraTooltip.Positioner>
      </ChakraTooltip.Root>
    );
  }
);
