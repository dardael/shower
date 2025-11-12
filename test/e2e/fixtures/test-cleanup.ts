import { TestDatabase } from './test-database';
import { COLLECTION_DEPENDENCIES, TestDependencies } from './test-dependencies';

/**
 * Test cleanup utility for collection-based cleanup
 * Provides targeted cleanup based on test project dependencies
 */

/**
 * Get collection dependencies for a specific test project
 * @param projectName - Name of the test project
 * @returns Test dependencies for the project
 */
export function getProjectDependencies(projectName: string): TestDependencies {
  const dependencies = COLLECTION_DEPENDENCIES[projectName];
  if (!dependencies) {
    throw new Error(`No dependencies found for project: ${projectName}`);
  }
  return dependencies;
}

/**
 * Setup test environment for a specific project
 * Connects to database and performs targeted cleanup
 * @param projectName - Name of the test project
 */
export async function setupTestEnvironment(projectName: string): Promise<void> {
  await TestDatabase.connect();

  const dependencies = getProjectDependencies(projectName);

  // Only cleanup if the project has write dependencies
  if (dependencies.collections.length > 0 && !dependencies.readOnly) {
    await TestDatabase.cleanCollections(dependencies.collections);
  }
}

/**
 * Teardown test environment for a specific project
 * Performs cleanup if needed and disconnects
 * @param projectName - Name of the test project
 */
export async function teardownTestEnvironment(
  projectName: string
): Promise<void> {
  const dependencies = getProjectDependencies(projectName);

  // Only cleanup if the project has write dependencies
  if (dependencies.collections.length > 0 && !dependencies.readOnly) {
    await TestDatabase.cleanCollections(dependencies.collections);
  }

  await TestDatabase.disconnect();
}

/**
 * Get all projects that depend on a specific collection
 * @param collectionName - Name of the collection
 * @returns Array of project names that depend on the collection
 */
export function getProjectsByCollection(collectionName: string): string[] {
  return Object.entries(COLLECTION_DEPENDENCIES)
    .filter(([, dependencies]) =>
      dependencies.collections.includes(collectionName)
    )
    .map(([projectName]) => projectName);
}

/**
 * Check if two projects can run in parallel without conflicts
 * @param project1 - First project name
 * @param project2 - Second project name
 * @returns True if projects can run in parallel
 */
export function canRunInParallel(project1: string, project2: string): boolean {
  const deps1 = getProjectDependencies(project1);
  const deps2 = getProjectDependencies(project2);

  // If both projects are read-only, they can run in parallel
  if (deps1.readOnly && deps2.readOnly) {
    return true;
  }

  // If one is read-only and the other doesn't share collections, they can run in parallel
  if (deps1.readOnly || deps2.readOnly) {
    const writeDeps = deps1.readOnly ? deps2 : deps1;
    const readDeps = deps1.readOnly ? deps1 : deps2;

    return !writeDeps.collections.some((collection) =>
      readDeps.collections.includes(collection)
    );
  }

  // If both write to different collections, they can run in parallel
  const sharedCollections = deps1.collections.filter((collection) =>
    deps2.collections.includes(collection)
  );

  return sharedCollections.length === 0;
}

/**
 * Get maximum parallel execution groups for fastest test execution
 * Uses an aggressive optimization strategy to minimize the number of sequential groups
 * and maximize the number of projects running in parallel
 * @returns Array of project groups that can run in parallel, ordered by size (largest first)
 */
export function getParallelExecutionGroups(): string[][] {
  const projects = Object.keys(COLLECTION_DEPENDENCIES);
  const groups: string[][] = [];
  const usedProjects = new Set<string>();

  // Sort projects strategically: read-only first, then by collection conflicts
  const sortedProjects = [...projects].sort((a, b) => {
    const depsA = getProjectDependencies(a);
    const depsB = getProjectDependencies(b);

    // Priority 1: Read-only projects (most flexible)
    if (depsA.readOnly && !depsB.readOnly) return -1;
    if (!depsA.readOnly && depsB.readOnly) return 1;

    // Priority 2: Projects with fewer collections (less likely to conflict)
    return depsA.collections.length - depsB.collections.length;
  });

  // Build maximum parallel groups using aggressive optimization
  while (usedProjects.size < projects.length) {
    let bestGroup: string[] = [];

    // Try each unused project as a starting point to find the absolute largest group
    for (const startProject of sortedProjects) {
      if (usedProjects.has(startProject)) continue;

      const currentGroup = [startProject];

      // Aggressively add all compatible projects to maximize group size
      for (const candidateProject of sortedProjects) {
        if (
          usedProjects.has(candidateProject) ||
          candidateProject === startProject
        )
          continue;

        // Check if candidate can run with ALL projects in current group
        const canAdd = currentGroup.every((groupProject) =>
          canRunInParallel(groupProject, candidateProject)
        );

        if (canAdd) {
          currentGroup.push(candidateProject);
        }
      }

      // Keep the largest group found for maximum parallelism
      if (currentGroup.length > bestGroup.length) {
        bestGroup = currentGroup;
      }
    }

    // Add the best group to maximize parallel execution
    if (bestGroup.length > 0) {
      groups.push(bestGroup);
      bestGroup.forEach((project) => usedProjects.add(project));
    } else {
      // Safety fallback: should never happen, but ensures completion
      const remainingProject = sortedProjects.find((p) => !usedProjects.has(p));
      if (remainingProject) {
        groups.push([remainingProject]);
        usedProjects.add(remainingProject);
      }
    }
  }

  // Sort groups by size (largest first) for maximum parallelism first
  groups.sort((a, b) => b.length - a.length);

  return groups;
}
