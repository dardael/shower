/// <reference types="@testing-library/jest-dom" />

declare global {
  namespace jest {
    interface Matchers<R = void> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string | RegExp): R;
      toHaveAttribute(attr: string, value?: string): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toHaveClass(...classNames: string[]): R;
      toHaveStyle(style: Record<string, string>): R;
      toHaveValue(value: string | number): R;
      toBeChecked(): R;
      toHaveFocus(): R;
      toBeEmptyDOMElement(): R;
      toContainElement(element: HTMLElement | null): R;
      toContainHTML(html: string): R;
      toHaveDescription(text: string | RegExp): R;
      toHaveDisplayValue(value: string | RegExp | Array<string | RegExp>): R;
      toHaveErrorMessage(text: string | RegExp): R;
      toHaveFormValues(values: Record<string, string | number | string[]>): R;
      toHaveRole(role: string): R;
      toHaveAccessibleDescription(text: string | RegExp): R;
      toHaveAccessibleName(text: string | RegExp): R;
      toBePartiallyChecked(): R;
      toBeRequired(): R;
      toBeInvalid(): R;
      toBeValid(): R;
    }
  }
}
