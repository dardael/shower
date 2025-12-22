'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SocialNetworkType } from '@/domain/settings/value-objects/SocialNetworkType';
import type {
  PageLoadState,
  PageLoadError,
  MenuItemDTO,
  PublicLogoDTO,
  CustomLoaderDTO,
} from '@/types/page-load-state';

const TIMEOUT_MS = 10000;

interface SocialNetworkDTO {
  type: SocialNetworkType;
  url: string;
  label: string;
  icon: string;
}

interface LayoutData {
  menuData: MenuItemDTO[];
  footerData: {
    name: string;
    socialNetworks: SocialNetworkDTO[];
  };
  logo: PublicLogoDTO | null;
}

interface UsePublicLayoutDataReturn {
  state: PageLoadState;
  data: LayoutData | null;
  retry: () => void;
  customLoader: CustomLoaderDTO | null;
}

/**
 * Custom hook for fetching only layout data (menu, footer, logo)
 * Used for pages that don't need page content (checkout, confirmation, etc.)
 */
export function usePublicLayoutData(): UsePublicLayoutDataReturn {
  const [state, setState] = useState<PageLoadState>({
    isLoading: true,
    isComplete: false,
    error: null,
    menuLoaded: false,
    footerLoaded: false,
    contentLoaded: true, // No content needed
    logoLoaded: false,
    startTime: Date.now(),
  });

  const [data, setData] = useState<LayoutData | null>(null);
  const [customLoader, setCustomLoader] = useState<CustomLoaderDTO | null>(
    null
  );

  // Fetch custom loader immediately
  useEffect(() => {
    const fetchLoader = async (): Promise<void> => {
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
        // Loader is optional
      }
    };
    fetchLoader();
  }, []);

  const fetchAllData = useCallback(async () => {
    const startTime = Date.now();

    setState({
      isLoading: true,
      isComplete: false,
      error: null,
      menuLoaded: false,
      footerLoaded: false,
      contentLoaded: true,
      logoLoaded: false,
      startTime,
    });

    setData(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const [menuResult, footerResult, logoResult] = await Promise.allSettled([
        fetchMenuData(controller.signal),
        fetchFooterData(controller.signal),
        fetchLogoData(controller.signal),
      ]);

      clearTimeout(timeoutId);

      if (controller.signal.aborted) {
        const timeoutError: PageLoadError = {
          message:
            'Cette page met plus de temps que prévu à charger. Veuillez réessayer.',
          failedSources: ['menu', 'footer'],
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

      const failures: Array<'menu' | 'footer'> = [];
      if (menuResult.status === 'rejected') failures.push('menu');
      if (footerResult.status === 'rejected') failures.push('footer');

      // Menu and footer are required, logo is optional
      if (failures.length > 0) {
        const error: PageLoadError = {
          message:
            'Impossible de charger la page. Veuillez vérifier votre connexion et réessayer.',
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

      const menuData =
        menuResult.status === 'fulfilled' ? menuResult.value : [];
      const footerData =
        footerResult.status === 'fulfilled'
          ? footerResult.value
          : { name: '', socialNetworks: [] };
      const logo = logoResult.status === 'fulfilled' ? logoResult.value : null;

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

      setData({
        menuData,
        footerData,
        logo,
      });
    } catch {
      const pageLoadError: PageLoadError = {
        message:
          'Impossible de charger la page. Veuillez vérifier votre connexion et réessayer.',
        failedSources: ['menu', 'footer'],
        isTimeout: false,
        timestamp: Date.now(),
      };

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: pageLoadError,
      }));
    }
  }, []);

  const retry = useCallback(() => {
    fetchAllData();
  }, [fetchAllData]);

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

async function fetchMenuData(signal: AbortSignal): Promise<MenuItemDTO[]> {
  const response = await fetch('/api/public/menu', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
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

async function fetchFooterData(signal: AbortSignal): Promise<{
  name: string;
  socialNetworks: SocialNetworkDTO[];
}> {
  const socialResponse = await fetch('/api/public/social-networks', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
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

  const nameResponse = await fetch('/api/public/website-name', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
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

async function fetchLogoData(
  signal: AbortSignal
): Promise<PublicLogoDTO | null> {
  const response = await fetch('/api/public/logo', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    signal,
  });

  if (!response.ok) {
    return null;
  }

  const result = await response.json();

  if (!result.success || !result.data) {
    return null;
  }

  const logoData: PublicLogoDTO = result.data;

  // Preload logo image
  await new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = logoData.url;
  });

  return logoData;
}
