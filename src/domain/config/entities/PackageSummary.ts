/**
 * Summary of package contents for preview display.
 */
export interface PackageSummary {
  menuItemCount: number;
  pageContentCount: number;
  settingsCount: number;
  socialNetworkCount: number;
  imageCount: number;
  totalSizeBytes: number;
}

export function createEmptyPackageSummary(): PackageSummary {
  return {
    menuItemCount: 0,
    pageContentCount: 0,
    settingsCount: 0,
    socialNetworkCount: 0,
    imageCount: 0,
    totalSizeBytes: 0,
  };
}
