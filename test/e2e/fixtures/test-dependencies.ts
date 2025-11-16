/**
 * Test dependency metadata interface for collection-based cleanup
 * Defines which MongoDB collections each test project depends on
 */

export interface TestDependencies {
  /** Array of collection names this test depends on */
  collections: string[];
  /** Whether this test only reads from collections (no cleanup needed) */
  readOnly?: boolean;
  /** Additional metadata for test isolation */
  metadata?: Record<string, unknown>;
}

export interface CollectionDependencyRegistry {
  /** Map of test project names to their dependencies */
  [projectName: string]: TestDependencies;
}

export interface TestFileDependency {
  /** Path to test file relative to test/e2e directory */
  filePath: string;
  /** Array of collection names this test depends on */
  collections: string[];
  /** Whether this test only reads from collections (no cleanup needed) */
  readOnly?: boolean;
  /** Additional metadata for test isolation */
  metadata?: Record<string, unknown>;
}

export interface TestFileRegistry {
  /** Map of test file paths to their dependencies */
  [filePath: string]: TestFileDependency;
}

/**
 * MongoDB collection names used in the application
 */
export const MONGODB_COLLECTIONS = {
  USERS: 'users',
  SOCIAL_NETWORKS: 'socialNetworks',
  WEBSITE_SETTINGS: 'websiteSettings',
} as const;

/**
 * Collection dependency registry for all test projects
 * Maps test project names to their required MongoDB collections
 */
export const COLLECTION_DEPENDENCIES: CollectionDependencyRegistry = {
  'admin-auth-tests': {
    collections: [
      MONGODB_COLLECTIONS.USERS,
      MONGODB_COLLECTIONS.WEBSITE_SETTINGS,
    ],
    readOnly: false,
  },
  'admin-ui-tests': {
    collections: [],
    readOnly: true,
  },
  'admin-api-tests': {
    collections: [],
    readOnly: true,
  },
  'admin-settings-tests': {
    collections: [MONGODB_COLLECTIONS.WEBSITE_SETTINGS],
    readOnly: false,
  },
  'admin-social-tests': {
    collections: [MONGODB_COLLECTIONS.SOCIAL_NETWORKS],
    readOnly: false,
  },
  'public-ui-tests': {
    collections: [],
    readOnly: true,
  },
  'public-social-tests': {
    collections: [MONGODB_COLLECTIONS.SOCIAL_NETWORKS],
    readOnly: true,
  },
  'admin-theme-tests': {
    collections: [
      MONGODB_COLLECTIONS.WEBSITE_SETTINGS,
      MONGODB_COLLECTIONS.USERS,
    ],
    readOnly: false,
  },
} as const;

/**
 * Test file dependency registry for individual test files
 * Maps test file paths to their required MongoDB collections
 */
export const TEST_FILE_DEPENDENCIES: TestFileRegistry = {
  'admin/admin-page.spec.ts': {
    filePath: 'admin/admin-page.spec.ts',
    collections: [
      MONGODB_COLLECTIONS.USERS,
      MONGODB_COLLECTIONS.WEBSITE_SETTINGS,
    ],
    readOnly: false,
  },
  'admin/admin-navigation.spec.ts': {
    filePath: 'admin/admin-navigation.spec.ts',
    collections: [],
    readOnly: true,
  },
  'admin/icon-management.spec.ts': {
    filePath: 'admin/icon-management.spec.ts',
    collections: [MONGODB_COLLECTIONS.WEBSITE_SETTINGS],
    readOnly: false,
  },
  'admin/logging-health-check.spec.ts': {
    filePath: 'admin/logging-health-check.spec.ts',
    collections: [],
    readOnly: true,
  },
  'admin/social-networks-management.spec.ts': {
    filePath: 'admin/social-networks-management.spec.ts',
    collections: [MONGODB_COLLECTIONS.SOCIAL_NETWORKS],
    readOnly: false,
  },
  'admin/theme-color-management.spec.ts': {
    filePath: 'admin/theme-color-management.spec.ts',
    collections: [MONGODB_COLLECTIONS.WEBSITE_SETTINGS],
    readOnly: false,
  },
  'public/social-networks-footer.spec.ts': {
    filePath: 'public/social-networks-footer.spec.ts',
    collections: [MONGODB_COLLECTIONS.SOCIAL_NETWORKS],
    readOnly: true,
  },
  'public-ui-tests/footer-visibility.spec.ts': {
    filePath: 'public-ui-tests/footer-visibility.spec.ts',
    collections: [],
    readOnly: true,
  },
} as const;
