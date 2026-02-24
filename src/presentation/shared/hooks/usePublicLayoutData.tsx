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
  customLoader: CustomLoaderDTO | null;
  loaderChecked: boolean;
  minLoaderElapsed: boolean;
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
  const [loaderChecked, setLoaderChecked] = useState(false);

  // True once the minimum display time (1s) has elapsed for the custom loader
  const [minLoaderElapsed, setMinLoaderElapsed] = useState(false);

  // Start minimum display timer once custom loader is confirmed
  useEffect(() => {
    if (!loaderChecked) return;
    if (!customLoader) {
      setMinLoaderElapsed(true);
      return;
    }
    const timer = setTimeout(() => setMinLoaderElapsed(true), 1000);
    return () => clearTimeout(timer);
  }, [loaderChecked, customLoader]);

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
      } finally {
        setLoaderChecked(true);
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
      const [menuResult, footerResult, logoResult] = await Promise.allSettled([
        fetchMenuData(),
        fetchFooterData(),
        fetchLogoData(),
      ]);

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

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    state,
    data,
    customLoader,
    loaderChecked,
    minLoaderElapsed,
  };
}

async function fetchMenuData(): Promise<MenuItemDTO[]> {
  const response = await fetch('/api/public/menu', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
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

async function fetchFooterData(): Promise<{
  name: string;
  socialNetworks: SocialNetworkDTO[];
}> {
  const socialResponse = await fetch('/api/public/social-networks', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
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

async function fetchLogoData(): Promise<PublicLogoDTO | null> {
  const response = await fetch('/api/public/logo', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
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
