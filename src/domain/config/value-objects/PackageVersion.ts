/**
 * PackageVersion value object for version compatibility checking.
 * Major version must match for compatibility.
 */
export class PackageVersion {
  private constructor(
    public readonly major: number,
    public readonly minor: number
  ) {}

  /**
   * Current application schema version.
   * Increment major for breaking changes, minor for compatible additions.
   */
  static readonly CURRENT = new PackageVersion(1, 1);

  static create(major: number, minor: number): PackageVersion {
    if (major < 0 || minor < 0) {
      throw new Error('Version numbers must be non-negative');
    }
    if (!Number.isInteger(major) || !Number.isInteger(minor)) {
      throw new Error('Version numbers must be integers');
    }
    return new PackageVersion(major, minor);
  }

  static fromString(version: string): PackageVersion {
    const match = version.match(/^(\d+)\.(\d+)$/);
    if (!match) {
      throw new Error(
        `Invalid version format: ${version}. Expected "major.minor"`
      );
    }
    return PackageVersion.create(
      parseInt(match[1], 10),
      parseInt(match[2], 10)
    );
  }

  isCompatibleWith(other: PackageVersion): boolean {
    return this.major === other.major;
  }

  toString(): string {
    return `${this.major}.${this.minor}`;
  }

  equals(other: PackageVersion): boolean {
    return this.major === other.major && this.minor === other.minor;
  }
}
