// Named constants for focus trap timing
const FOCUS_DELAY_MS = 100;

export interface FocusTrapOptions {
  containerSelector: string;
  onEscape?: () => void;
}

export class FocusTrap {
  private containerSelector: string;
  private onEscape?: () => void;
  private previouslyFocusedElement: HTMLElement | null = null;
  private keyDownHandler: ((event: KeyboardEvent) => void) | null = null;

  constructor(options: FocusTrapOptions) {
    this.containerSelector = options.containerSelector;
    this.onEscape = options.onEscape;
  }

  activate(): void {
    // Store current focus and set up event listeners
    this.previouslyFocusedElement = document.activeElement as HTMLElement;
    this.keyDownHandler = this.handleKeyDown.bind(this);
    document.addEventListener('keydown', this.keyDownHandler);

    // Focus first element after a short delay
    this.focusFirstElement();
  }

  deactivate(): void {
    // Clean up event listeners
    if (this.keyDownHandler) {
      document.removeEventListener('keydown', this.keyDownHandler);
      this.keyDownHandler = null;
    }

    // Restore previous focus
    this.restoreFocus();
  }

  private getFocusableElements(): HTMLElement[] {
    const selector = `${this.containerSelector} button, ${this.containerSelector} a, ${this.containerSelector} input, ${this.containerSelector} select, ${this.containerSelector} textarea, ${this.containerSelector} [tabindex]:not([tabindex="-1"])`;

    return Array.from(document.querySelectorAll(selector)).filter((element) => {
      const el = element as HTMLElement;
      return (
        !el.hasAttribute('disabled') &&
        el.getClientRects().length > 0 &&
        window.getComputedStyle(el).visibility !== 'hidden'
      );
    }) as HTMLElement[];
  }

  private focusFirstElement(): void {
    const focusableElements = this.getFocusableElements();
    if (focusableElements.length > 0) {
      setTimeout(() => focusableElements[0].focus(), FOCUS_DELAY_MS);
    }
  }

  private restoreFocus(): void {
    if (this.previouslyFocusedElement?.focus) {
      setTimeout(() => this.previouslyFocusedElement!.focus(), FOCUS_DELAY_MS);
    }
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.onEscape?.();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusableElements = this.getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement as HTMLElement;

    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault();
      lastElement?.focus();
    } else if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement?.focus();
    }
  }
}
