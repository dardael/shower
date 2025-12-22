import { PlaceholderReplacer } from '@/infrastructure/email/services/PlaceholderReplacer';
import { Order } from '@/domain/order/entities/Order';

describe('PlaceholderReplacer', () => {
  let placeholderReplacer: PlaceholderReplacer;

  beforeEach(() => {
    placeholderReplacer = new PlaceholderReplacer();
  });

  const createMockOrder = (): Order => {
    return Order.create(
      {
        customerFirstName: 'Jean',
        customerLastName: 'Dupont',
        customerEmail: 'jean.dupont@example.com',
        customerPhone: '0612345678',
        items: [
          {
            productId: 'prod-1',
            productName: 'T-shirt Bleu',
            quantity: 2,
            unitPrice: 25.99,
          },
          {
            productId: 'prod-2',
            productName: 'Jean Slim',
            quantity: 1,
            unitPrice: 59.99,
          },
        ],
      },
      'order-123'
    );
  };

  describe('replacePlaceholders', () => {
    it('should replace {{order_id}} with the order ID', () => {
      const order = createMockOrder();
      const template = 'Commande {{order_id}} reçue';

      const result = placeholderReplacer.replacePlaceholders(template, order);

      expect(result).toContain(order.id);
      expect(result).not.toContain('{{order_id}}');
    });

    it('should replace {{customer_firstname}} with the customer first name', () => {
      const order = createMockOrder();
      const template = 'Bonjour {{customer_firstname}}';

      const result = placeholderReplacer.replacePlaceholders(template, order);

      expect(result).toBe('Bonjour Jean');
    });

    it('should replace {{customer_lastname}} with the customer last name', () => {
      const order = createMockOrder();
      const template = 'Client: {{customer_lastname}}';

      const result = placeholderReplacer.replacePlaceholders(template, order);

      expect(result).toBe('Client: Dupont');
    });

    it('should replace {{customer_email}} with the customer email', () => {
      const order = createMockOrder();
      const template = 'Email: {{customer_email}}';

      const result = placeholderReplacer.replacePlaceholders(template, order);

      expect(result).toBe('Email: jean.dupont@example.com');
    });

    it('should replace {{customer_phone}} with the customer phone', () => {
      const order = createMockOrder();
      const template = 'Téléphone: {{customer_phone}}';

      const result = placeholderReplacer.replacePlaceholders(template, order);

      expect(result).toBe('Téléphone: 0612345678');
    });

    it('should replace {{order_total}} with the formatted total price', () => {
      const order = createMockOrder();
      const template = 'Total: {{order_total}}';

      const result = placeholderReplacer.replacePlaceholders(template, order);

      // Total: 2 * 25.99 + 1 * 59.99 = 111.97
      expect(result).toMatch(/Total: 111[,.]97/);
    });

    it('should replace {{products_list}} with formatted product list', () => {
      const order = createMockOrder();
      const template = 'Produits:\n{{products_list}}';

      const result = placeholderReplacer.replacePlaceholders(template, order);

      expect(result).toContain('T-shirt Bleu');
      expect(result).toContain('x2');
      expect(result).toContain('Jean Slim');
      expect(result).toContain('x1');
    });

    it('should replace {{order_date}} with the formatted order date', () => {
      const order = createMockOrder();
      const template = 'Date: {{order_date}}';

      const result = placeholderReplacer.replacePlaceholders(template, order);

      expect(result).not.toContain('{{order_date}}');
      // Should contain a date in French format
      expect(result).toMatch(/Date: \d{2}\/\d{2}\/\d{4}/);
    });

    it('should replace multiple placeholders in the same template', () => {
      const order = createMockOrder();
      const template =
        'Bonjour {{customer_firstname}} {{customer_lastname}}, votre commande {{order_id}} a été reçue.';

      const result = placeholderReplacer.replacePlaceholders(template, order);

      expect(result).toContain('Bonjour Jean Dupont');
      expect(result).toContain(order.id);
      expect(result).not.toContain('{{');
      expect(result).not.toContain('}}');
    });

    it('should handle templates with no placeholders', () => {
      const order = createMockOrder();
      const template = 'Merci pour votre commande!';

      const result = placeholderReplacer.replacePlaceholders(template, order);

      expect(result).toBe('Merci pour votre commande!');
    });

    it('should leave unrecognized placeholders as-is', () => {
      const order = createMockOrder();
      const template = 'Test {{unknown_placeholder}} value';

      const result = placeholderReplacer.replacePlaceholders(template, order);

      expect(result).toBe('Test {{unknown_placeholder}} value');
    });
  });

  describe('getAvailablePlaceholders', () => {
    it('should return all available placeholders with descriptions', () => {
      const placeholders = placeholderReplacer.getAvailablePlaceholders();

      expect(placeholders.length).toBeGreaterThan(0);
      expect(placeholders).toContainEqual(
        expect.objectContaining({
          syntax: '{{order_id}}',
        })
      );
      expect(placeholders).toContainEqual(
        expect.objectContaining({
          syntax: '{{customer_firstname}}',
        })
      );
      expect(placeholders).toContainEqual(
        expect.objectContaining({
          syntax: '{{order_total}}',
        })
      );
    });

    it('should include description for each placeholder', () => {
      const placeholders = placeholderReplacer.getAvailablePlaceholders();

      placeholders.forEach((placeholder) => {
        expect(placeholder.syntax).toBeDefined();
        expect(placeholder.description).toBeDefined();
        expect(placeholder.description.length).toBeGreaterThan(0);
      });
    });
  });
});
