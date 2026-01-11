import { ClientInfo } from '@/domain/appointment/value-objects/ClientInfo';

describe('ClientInfo', () => {
  describe('create', () => {
    it('should create valid client info with required fields only', () => {
      const clientInfo = ClientInfo.create({
        name: 'Jean Dupont',
        email: 'jean@example.com',
      });

      expect(clientInfo.name).toBe('Jean Dupont');
      expect(clientInfo.email).toBe('jean@example.com');
      expect(clientInfo.phone).toBeUndefined();
      expect(clientInfo.address).toBeUndefined();
      expect(clientInfo.customField).toBeUndefined();
    });

    it('should create valid client info with all fields', () => {
      const clientInfo = ClientInfo.create({
        name: 'Jean Dupont',
        email: 'jean@example.com',
        phone: '+33612345678',
        address: '123 Rue de Paris, 75001 Paris',
        customField: 'Première visite',
      });

      expect(clientInfo.name).toBe('Jean Dupont');
      expect(clientInfo.email).toBe('jean@example.com');
      expect(clientInfo.phone).toBe('+33612345678');
      expect(clientInfo.address).toBe('123 Rue de Paris, 75001 Paris');
      expect(clientInfo.customField).toBe('Première visite');
    });

    it('should throw error for empty name', () => {
      expect(() =>
        ClientInfo.create({
          name: '',
          email: 'jean@example.com',
        })
      ).toThrow('Le nom du client est requis');
    });

    it('should throw error for whitespace-only name', () => {
      expect(() =>
        ClientInfo.create({
          name: '   ',
          email: 'jean@example.com',
        })
      ).toThrow('Le nom du client est requis');
    });

    it('should throw error for empty email', () => {
      expect(() =>
        ClientInfo.create({
          name: 'Jean Dupont',
          email: '',
        })
      ).toThrow("L'adresse email est requise");
    });

    it('should throw error for invalid email format', () => {
      expect(() =>
        ClientInfo.create({
          name: 'Jean Dupont',
          email: 'invalid-email',
        })
      ).toThrow("Format d'adresse email invalide");
    });
  });

  describe('toObject', () => {
    it('should return plain object representation', () => {
      const clientInfo = ClientInfo.create({
        name: 'Jean Dupont',
        email: 'jean@example.com',
        phone: '+33612345678',
      });

      const obj = clientInfo.toObject();

      expect(obj).toEqual({
        name: 'Jean Dupont',
        email: 'jean@example.com',
        phone: '+33612345678',
        address: undefined,
        customField: undefined,
      });
    });
  });

  describe('equality', () => {
    it('should be equal when all fields match', () => {
      const info1 = ClientInfo.create({
        name: 'Jean Dupont',
        email: 'jean@example.com',
      });
      const info2 = ClientInfo.create({
        name: 'Jean Dupont',
        email: 'jean@example.com',
      });
      expect(info1.equals(info2)).toBe(true);
    });

    it('should not be equal when fields differ', () => {
      const info1 = ClientInfo.create({
        name: 'Jean Dupont',
        email: 'jean@example.com',
      });
      const info2 = ClientInfo.create({
        name: 'Marie Dupont',
        email: 'marie@example.com',
      });
      expect(info1.equals(info2)).toBe(false);
    });
  });
});
