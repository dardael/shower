/**
 * Summary of package contents for preview display.
 */
export interface PackageSummary {
  menuItemCount: number;
  pageContentCount: number;
  settingsCount: number;
  socialNetworkCount: number;
  imageCount: number;
  productCount: number;
  categoryCount: number;
  activityCount: number;
  hasAvailability: boolean;
  totalSizeBytes: number;
}

export function createEmptyPackageSummary(): PackageSummary {
  return {
    menuItemCount: 0,
    pageContentCount: 0,
    settingsCount: 0,
    socialNetworkCount: 0,
    imageCount: 0,
    productCount: 0,
    categoryCount: 0,
    activityCount: 0,
    hasAvailability: false,
    totalSizeBytes: 0,
  };
}
