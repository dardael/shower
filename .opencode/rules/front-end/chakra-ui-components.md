Sub rule 1: Component Structure
- Import Chakra UI components from `@chakra-ui/react`
- Use Chakra UI layout components (`Box`, `Stack`, `Flex`, `Grid`) instead of custom divs
- Prefer semantic Chakra components (`Container`, `Heading`, `Text`) over HTML elements
- Use Chakra v3 form components with compound patterns (`Field.Root`, `Field.Label`, `Input`, `Field.ErrorText`)
- Use `asChild` prop for styling external components like Next.js Image/Link
  - Use {"my ' text"} when a text has a caracter to encode to avoid to write the encoded caracter

Sub rule 2: Responsive Design
- Use Chakra's responsive object syntax: `{{ base: 'sm', md: 'lg', xl: 'xl' }}`
- Use range notation for better control: `{{ mdDown: 'full', md: 'auto' }}`
- Use single breakpoint notation: `{{ lgOnly: 'block' }}` for specific breakpoints
- Apply responsive spacing: `p={{ base: 2, md: 4, lg: 6 }}` for padding
- Use `hideFrom="md"` and `hideBelow="md"` for conditional visibility

Sub rule 3: Dark Mode Support
- Use semantic color tokens: `bg="bg.subtle"`, `bg="bg.muted"` instead of hard colors
- Use `color="fg"` or `color="fg.muted"` for text colors
- Apply border colors with `borderColor="border"` for theme consistency
- Use `_dark` pseudo-prop for dark mode specific styles: `bg={{ base: "white", _dark: "black" }}`
- Import color mode components: `ColorModeButton`, `DarkMode`, `LightMode` from color-mode module

Sub rule 4: Styling and Spacing
- Use Chakra's spacing scale (`2`, `4`, `8`, etc.) instead of arbitrary values
- Apply semantic props: `textAlign="center"` instead of style props
- Use `colorPalette` system for dynamic theming: `colorPalette="blue"`
- Use virtual colors: `bg="colorPalette.solid"`, `color="colorPalette.contrast"`
- Leverage `gap` for spacing between flex/grid items
- Use `divideY`, `divideX` for borders between elements

Sub rule 5: Conditional Styling and States
- Use pseudo-props for states: `_hover={{ bg: "blue.600" }}`, `_focus={{ ring: "2px" }}`
- Use `_active`, `_disabled` for interaction states
- Use `_groupHover` with `className="group"` for parent-child state styling
- Use `_peerHover` with `className="peer"` for sibling state styling
- Apply ARIA-based styling: `_expanded={{ bg: "gray.500" }}`, `_loading={{ opacity: 0.5 }}`

Sub rule 6: Accessibility
- Use Chakra's built-in accessibility features and ARIA support
- Apply proper `aria` labels when using custom components
- Ensure keyboard navigation works with Chakra components
- Use focus ring customization: `focusRingWidth="2px"`, `focusRingStyle="dashed"`

Sub rule 7: Component Composition
- Wrap components in `Box` or `Stack` for layout structure
- Use `VStack` for vertical layouts, `HStack` for horizontal
- Use `chakra()` factory to style external components
- Use `layerStyle` and `textStyle` for consistent styling patterns

Sub rule 8: Form Component Patterns (Chakra UI v3)
- Use `Field.Root` with `invalid` prop for form validation instead of `Input invalid`
- Structure forms as: `<Field.Root><Field.Label/><Input/><Field.ErrorText/></Field.Root>`
- Use compound components for checkboxes: `<Checkbox.Root><Checkbox.HiddenInput/><Checkbox.Control><Checkbox.Indicator/></Checkbox.Control><Checkbox.Label/></Checkbox.Root>`
- Use simplified checkbox when default icons suffice: `<Checkbox.Control/>`
- Use radio groups with compound pattern: `<RadioGroup.Root><RadioGroup.Item><RadioGroup.ItemHiddenInput/><RadioGroup.ItemIndicator/><RadioGroup.ItemText/></RadioGroup.Item></RadioGroup.Root>`
- Use `NativeSelect.Root` instead of old `Select` component: `<NativeSelect.Root><NativeSelect.Field/><NativeSelect.Indicator/></NativeSelect.Root>`
- Use `NumberInput.Root` for numeric inputs: `<NumberInput.Root><NumberInput.Label/><NumberInput.Input/><NumberInput.ErrorMessage/></NumberInput.Root>`
- Use `Textarea` with responsive sizing: `<Textarea autoresize maxH="5lh"/>`
- Use form styling with pseudo-props: `_placeholder={{ color: "gray.500" }}`, `_file={{ bg: "gray.500" }}`
