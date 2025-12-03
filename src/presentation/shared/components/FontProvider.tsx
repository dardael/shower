'use client';

import { ReactNode, useEffect } from 'react';
import {
  WebsiteFontProvider,
  useWebsiteFontContext,
} from '@/presentation/shared/contexts/WebsiteFontContext';
import { WebsiteFont } from '@/domain/settings/value-objects/WebsiteFont';

interface FontProviderProps {
  children: ReactNode;
}

/**
 * Internal component that handles font loading and CSS variable injection
 * Must be used within WebsiteFontProvider
 */
function FontInjector({ children }: { children: ReactNode }) {
  const { websiteFont } = useWebsiteFontContext();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const fontObj = WebsiteFont.fromString(websiteFont);
    const googleFontsUrl = fontObj.getGoogleFontsUrl();
    const fontFamily = fontObj.getFontFamily();

    // Remove any existing font link
    const existingLink = document.getElementById('website-font-link');
    if (existingLink) {
      existingLink.remove();
    }

    // Create and inject Google Fonts link
    const link = document.createElement('link');
    link.id = 'website-font-link';
    link.rel = 'stylesheet';
    link.href = googleFontsUrl;
    document.head.appendChild(link);

    // Set CSS variable on document root
    document.documentElement.style.setProperty('--website-font', fontFamily);

    // Also apply font to body for immediate effect
    document.body.style.fontFamily = `var(--website-font), system-ui, sans-serif`;

    return () => {
      // Cleanup link on unmount
      const linkToRemove = document.getElementById('website-font-link');
      if (linkToRemove) {
        linkToRemove.remove();
      }
    };
  }, [websiteFont]);

  return <>{children}</>;
}

/**
 * FontProvider component that provides website font context and injects
 * the Google Fonts stylesheet and CSS variable
 */
export function FontProvider({ children }: FontProviderProps) {
  return (
    <WebsiteFontProvider>
      <FontInjector>{children}</FontInjector>
    </WebsiteFontProvider>
  );
}
