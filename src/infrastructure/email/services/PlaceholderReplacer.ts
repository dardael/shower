import type { Order } from '@/domain/order/entities/Order';

interface PlaceholderDefinition {
  syntax: string;
  description: string;
  resolver: (order: Order) => string;
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

const formatProductsList = (order: Order): string => {
  return order.items
    .map(
      (item) =>
        `- ${item.productName} x${item.quantity} : ${formatCurrency(item.unitPrice * item.quantity)}`
    )
    .join('\n');
};

export interface AppointmentPlaceholderDefinition {
  syntax: string;
  description: string;
}

export const PLACEHOLDER_DEFINITIONS: PlaceholderDefinition[] = [
  {
    syntax: '{{order_id}}',
    description: 'Identifiant unique de la commande',
    resolver: (order) => order.id,
  },
  {
    syntax: '{{order_date}}',
    description: 'Date et heure de la commande',
    resolver: (order) => formatDate(order.createdAt),
  },
  {
    syntax: '{{order_total}}',
    description: 'Montant total de la commande',
    resolver: (order) => formatCurrency(order.totalPrice),
  },
  {
    syntax: '{{customer_firstname}}',
    description: 'Prénom du client',
    resolver: (order) => order.customerFirstName,
  },
  {
    syntax: '{{customer_lastname}}',
    description: 'Nom du client',
    resolver: (order) => order.customerLastName,
  },
  {
    syntax: '{{customer_email}}',
    description: 'Adresse email du client',
    resolver: (order) => order.customerEmail,
  },
  {
    syntax: '{{customer_phone}}',
    description: 'Numéro de téléphone du client',
    resolver: (order) => order.customerPhone || '',
  },
  {
    syntax: '{{products_list}}',
    description: 'Liste formatée des produits commandés',
    resolver: formatProductsList,
  },
];

export const APPOINTMENT_PLACEHOLDER_DEFINITIONS: AppointmentPlaceholderDefinition[] =
  [
    {
      syntax: '{{appointment_activity}}',
      description: "Nom de l'activité du rendez-vous",
    },
    {
      syntax: '{{appointment_date}}',
      description: 'Date du rendez-vous',
    },
    {
      syntax: '{{appointment_time}}',
      description: 'Heure du rendez-vous',
    },
    {
      syntax: '{{appointment_duration}}',
      description: 'Durée du rendez-vous en minutes',
    },
    {
      syntax: '{{customer_name}}',
      description: 'Nom complet du client',
    },
    {
      syntax: '{{customer_email}}',
      description: 'Adresse email du client',
    },
    {
      syntax: '{{customer_phone}}',
      description: 'Numéro de téléphone du client',
    },
    {
      syntax: '{{customer_notes}}',
      description: 'Notes du client',
    },
  ];

export class PlaceholderReplacer {
  replacePlaceholders(template: string, order: Order): string {
    let result = template;

    for (const placeholder of PLACEHOLDER_DEFINITIONS) {
      const value = placeholder.resolver(order);
      result = result.replace(
        new RegExp(this.escapeRegex(placeholder.syntax), 'g'),
        value
      );
    }

    return result;
  }

  getAvailablePlaceholders(): Array<{ syntax: string; description: string }> {
    return PLACEHOLDER_DEFINITIONS.map(({ syntax, description }) => ({
      syntax,
      description,
    }));
  }

  private escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
