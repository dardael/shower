'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SocialNetworkType } from '@/domain/settings/value-objects/SocialNetworkType';
import type {
  PageLoadState,
  PageLoadError,
  PublicPageData,
  UsePublicPageDataReturn,
  WebsiteSettingsData,
  MenuItemDTO,
  PageContentDTO,
  PublicLogoDTO,
  CustomLoaderDTO,
} from '@/types/page-load-state';

const TIMEOUT_MS = 10000; // 10 seconds

interface SocialNetworkDTO {
  type: SocialNetworkType;
  url: string;
  label: string;
  icon: string;
}

/**
 * Custom hook for managing loading state of public pages
 * Coordinates parallel fetching of menu, footer, and page content
 */
export function usePublicPageData(slug: string): UsePublicPageDataReturn & {
  customLoader: CustomLoaderDTO | null;
} {
  // Initialize loading state
  const [state, setState] = useState<PageLoadState>({
    isLoading: true,
    isComplete: false,
    error: null,
    menuLoaded: false,
    footerLoaded: false,
    contentLoaded: false,
    logoLoaded: false,
    startTime: Date.now(),
  });

  const [data, setData] = useState<PublicPageData | null>(null);

  // Separate state for custom loader - fetched early and independently
  const [customLoader, setCustomLoader] = useState<CustomLoaderDTO | null>(
    null
  );

  // Fetch custom loader immediately on mount (before other data)
  useEffect(() => {
    const fetchLoader = async () => {
      try {
        const response = await fetch('/api/public/loader', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const result = await response.json();
          if (result.loader) {
            setCustomLoader(result.loader);
          }
        }
      } catch {
        // Loader is optional, ignore errors
      }
    };
    fetchLoader();
  }, []);

  // Fetch all data sources in parallel
  const fetchAllData = useCallback(async () => {
    const startTime = Date.now();

    // Reset state
    setState({
      isLoading: true,
      isComplete: false,
      error: null,
      menuLoaded: false,
      footerLoaded: false,
      contentLoaded: false,
      logoLoaded: false,
      startTime,
    });

    setData(null);

    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      // Fetch all data sources in parallel using Promise.allSettled
      const [menuResult, footerResult, logoResult] = await Promise.allSettled([
        fetchMenuData(controller.signal),
        fetchFooterData(controller.signal),
        fetchLogoData(controller.signal),
      ]);

      // Get menu data to find the page content
      const menuData =
        menuResult.status === 'fulfilled' ? menuResult.value : null;

      // Fetch page content with menu data (avoids duplicate menu fetch)
      const contentResult = await (async () => {
        try {
          if (!menuData) {
            throw new Error('Menu data required to fetch page content');
          }
          return {
            status: 'fulfilled' as const,
            value: await fetchPageContentWithMenu(
              slug,
              menuData,
              controller.signal
            ),
          };
        } catch (error) {
          return { status: 'rejected' as const, reason: error };
        }
      })();

      clearTimeout(timeoutId);

      // Check if timeout occurred (using abort signal status)
      if (controller.signal.aborted) {
        const failedSources: Array<'menu' | 'footer' | 'content'> = [];
        if (menuResult.status === 'rejected') failedSources.push('menu');
        if (footerResult.status === 'rejected') failedSources.push('footer');
        if (contentResult.status === 'rejected') failedSources.push('content');

        const timeoutError: PageLoadError = {
          message:
            'This page is taking longer than expected to load. Please try again.',
          failedSources:
            failedSources.length > 0
              ? failedSources
              : ['menu', 'footer', 'content'],
          isTimeout: true,
          timestamp: Date.now(),
        };

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: timeoutError,
        }));
        return;
      }

      // Check for failures
      const failures: Array<'menu' | 'footer' | 'content'> = [];
      if (menuResult.status === 'rejected') failures.push('menu');
      if (footerResult.status === 'rejected') failures.push('footer');
      if (contentResult.status === 'rejected') failures.push('content');

      if (failures.length > 0) {
        const error: PageLoadError = {
          message:
            'Unable to load page content. Please check your connection and try again.',
          failedSources: failures,
          isTimeout: false,
          timestamp: Date.now(),
        };

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error,
        }));
        return;
      }

      // All data loaded successfully
      const footerData =
        footerResult.status === 'fulfilled'
          ? footerResult.value
          : { name: '', socialNetworks: [] };
      const pageContent =
        contentResult.status === 'fulfilled' ? contentResult.value : null;

      // Update state to complete
      setState({
        isLoading: false,
        isComplete: true,
        error: null,
        menuLoaded: true,
        footerLoaded: true,
        contentLoaded: true,
        logoLoaded: true,
        startTime,
      });

      // Set data
      setData({
        menuData: menuData || [],
        footerData,
        pageContent: pageContent!,
        logo: logoResult.status === 'fulfilled' ? logoResult.value : null,
      });
    } catch {
      // Catch any unexpected errors during data fetching
      const pageLoadError: PageLoadError = {
        message:
          'Unable to load page content. Please check your connection and try again.',
        failedSources: ['menu', 'footer', 'content'],
        isTimeout: false,
        timestamp: Date.now(),
      };

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: pageLoadError,
      }));
    }
  }, [slug]);

  // Retry function
  const retry = useCallback(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Fetch data on mount and when slug changes
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    state,
    data,
    retry,
    customLoader,
  };
}

/**
 * Fetch menu data from API
 */
async function fetchMenuData(signal: AbortSignal): Promise<MenuItemDTO[]> {
  const response = await fetch('/api/public/menu', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch menu items: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch menu items');
  }

  return result.data || [];
}

/**
 * Fetch footer data (website settings and social networks) from API
 */
async function fetchFooterData(
  signal: AbortSignal
): Promise<WebsiteSettingsData> {
  // Fetch social networks
  const socialResponse = await fetch('/api/public/social-networks', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
  });

  if (!socialResponse.ok) {
    throw new Error(
      `Failed to fetch social networks: ${socialResponse.status}`
    );
  }

  const socialResult = await socialResponse.json();

  if (!socialResult.success) {
    throw new Error(socialResult.error || 'Failed to fetch social networks');
  }

  const socialNetworks = (socialResult.data || []).map(
    (sn: SocialNetworkDTO) => ({
      type: sn.type,
      url: sn.url,
      label: sn.label,
      icon: sn.icon,
    })
  );

  // Fetch website name
  const nameResponse = await fetch('/api/public/website-name', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
  });

  let websiteName = '';
  if (nameResponse.ok) {
    const nameResult = await nameResponse.json();
    if (nameResult.success && nameResult.data) {
      websiteName = nameResult.data;
    }
  }

  return {
    name: websiteName,
    socialNetworks,
  };
}

/**
 * Fetch page content from API based on slug
 * Uses already-fetched menu data to avoid duplicate API calls
 */
async function fetchPageContentWithMenu(
  slug: string,
  menuItems: MenuItemDTO[],
  signal: AbortSignal
): Promise<PageContentDTO> {
  if (menuItems.length === 0) {
    throw new Error('No menu items available');
  }

  let menuItem;

  // Special case: 'home' slug means use first menu item
  if (slug === 'home') {
    menuItem = menuItems[0];
  } else {
    const slugWithSlash = slug.startsWith('/') ? slug : `/${slug}`;
    const slugWithoutSlash = slug.startsWith('/') ? slug.slice(1) : slug;

    menuItem = menuItems.find(
      (item) => item.url === slugWithSlash || item.url === slugWithoutSlash
    );

    if (!menuItem) {
      throw new Error('Page not found');
    }
  }

  // Fetch page content
  const response = await fetch(`/api/pages/${menuItem.id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch page content: ${response.status}`);
  }

  const result = await response.json();

  if (!result) {
    throw new Error('Failed to fetch page content');
  }

  return result;
}

/**
 * Fetch logo data from public API and preload the image
 */
async function fetchLogoData(
  signal: AbortSignal
): Promise<PublicLogoDTO | null> {
  const response = await fetch('/api/public/logo', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    // Logo is optional, return null on error
    return null;
  }

  const result = await response.json();

  if (!result.success || !result.data) {
    return null;
  }

  const logoData: PublicLogoDTO = result.data;

  // Preload the logo image to ensure it's cached before displaying
  await preloadImage(logoData.url);

  return logoData;
}

/**
 * Preload an image by creating an Image element and waiting for it to load
 */
function preloadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // Resolve even on error to not block loading
    img.src = url;
  });
}
