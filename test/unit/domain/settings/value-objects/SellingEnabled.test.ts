import { SellingEnabled } from '@/domain/settings/value-objects/SellingEnabled';

describe('SellingEnabled', () => {
  describe('create', () => {
    it('should create with boolean true', () => {
      const result = SellingEnabled.create(true);
      expect(result.value).toBe(true);
    });

    it('should create with boolean false', () => {
      const result = SellingEnabled.create(false);
      expect(result.value).toBe(false);
    });

    it('should create with string "true"', () => {
      const result = SellingEnabled.create('true');
      expect(result.value).toBe(true);
    });

    it('should create with string "false"', () => {
      const result = SellingEnabled.create('false');
      expect(result.value).toBe(false);
    });

    it('should return default (false) for invalid values', () => {
      expect(SellingEnabled.create('invalid').value).toBe(false);
      expect(SellingEnabled.create(null).value).toBe(false);
      expect(SellingEnabled.create(undefined).value).toBe(false);
      expect(SellingEnabled.create(123).value).toBe(false);
      expect(SellingEnabled.create({}).value).toBe(false);
    });
  });

  describe('static factory methods', () => {
    it('should return false for default()', () => {
      expect(SellingEnabled.default().value).toBe(false);
    });

    it('should return true for enabled()', () => {
      expect(SellingEnabled.enabled().value).toBe(true);
    });

    it('should return false for disabled()', () => {
      expect(SellingEnabled.disabled().value).toBe(false);
    });
  });

  describe('isEnabled', () => {
    it('should return true when value is true', () => {
      const result = SellingEnabled.enabled();
      expect(result.isEnabled()).toBe(true);
    });

    it('should return false when value is false', () => {
      const result = SellingEnabled.disabled();
      expect(result.isEnabled()).toBe(false);
    });
  });

  describe('isDisabled', () => {
    it('should return true when value is false', () => {
      const result = SellingEnabled.disabled();
      expect(result.isDisabled()).toBe(true);
    });

    it('should return false when value is true', () => {
      const result = SellingEnabled.enabled();
      expect(result.isDisabled()).toBe(false);
    });
  });

  describe('equals', () => {
    it('should return true for equal values', () => {
      const a = SellingEnabled.enabled();
      const b = SellingEnabled.enabled();
      expect(a.equals(b)).toBe(true);
    });

    it('should return false for different values', () => {
      const a = SellingEnabled.enabled();
      const b = SellingEnabled.disabled();
      expect(a.equals(b)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return "enabled" when true', () => {
      expect(SellingEnabled.enabled().toString()).toBe('enabled');
    });

    it('should return "disabled" when false', () => {
      expect(SellingEnabled.disabled().toString()).toBe('disabled');
    });
  });
});
