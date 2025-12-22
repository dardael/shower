export type EmailTemplateType = 'admin' | 'purchaser';

export interface EmailTemplateData {
  type: EmailTemplateType;
  subject: string;
  body: string;
  enabled: boolean;
}

const DEFAULT_ADMIN_SUBJECT = 'Nouvelle commande {{order_id}}';
const DEFAULT_ADMIN_BODY = `Nouvelle commande reçue!

Numéro de commande: {{order_id}}
Date: {{order_date}}

Client:
{{customer_firstname}} {{customer_lastname}}
Email: {{customer_email}}
Téléphone: {{customer_phone}}

Produits commandés:
{{products_list}}

Total: {{order_total}}`;

const DEFAULT_PURCHASER_SUBJECT = 'Confirmation de votre commande {{order_id}}';
const DEFAULT_PURCHASER_BODY = `Bonjour {{customer_firstname}},

Merci pour votre commande!

Numéro de commande: {{order_id}}
Date: {{order_date}}

Récapitulatif de votre commande:
{{products_list}}

Total: {{order_total}}

Cordialement,
L'équipe`;

export class EmailTemplate {
  private constructor(private readonly data: EmailTemplateData) {}

  static create(data: EmailTemplateData): EmailTemplate {
    EmailTemplate.validate(data);
    return new EmailTemplate(data);
  }

  static createDefault(type: EmailTemplateType): EmailTemplate {
    if (type === 'admin') {
      return new EmailTemplate({
        type: 'admin',
        subject: DEFAULT_ADMIN_SUBJECT,
        body: DEFAULT_ADMIN_BODY,
        enabled: false,
      });
    }
    return new EmailTemplate({
      type: 'purchaser',
      subject: DEFAULT_PURCHASER_SUBJECT,
      body: DEFAULT_PURCHASER_BODY,
      enabled: false,
    });
  }

  private static validate(data: EmailTemplateData): void {
    if (data.type !== 'admin' && data.type !== 'purchaser') {
      throw new Error('Type de template invalide');
    }
    if (!data.subject || data.subject.trim() === '') {
      throw new Error('Le sujet ne peut pas être vide');
    }
    if (data.subject.length > 200) {
      throw new Error('Le sujet ne peut pas dépasser 200 caractères');
    }
    if (!data.body || data.body.trim() === '') {
      throw new Error('Le corps du message ne peut pas être vide');
    }
    if (data.body.length > 10000) {
      throw new Error(
        'Le corps du message ne peut pas dépasser 10000 caractères'
      );
    }
  }

  get type(): EmailTemplateType {
    return this.data.type;
  }

  get subject(): string {
    return this.data.subject;
  }

  get body(): string {
    return this.data.body;
  }

  get enabled(): boolean {
    return this.data.enabled;
  }

  withSubject(subject: string): EmailTemplate {
    return EmailTemplate.create({ ...this.data, subject });
  }

  withBody(body: string): EmailTemplate {
    return EmailTemplate.create({ ...this.data, body });
  }

  withEnabled(enabled: boolean): EmailTemplate {
    return EmailTemplate.create({ ...this.data, enabled });
  }

  toJSON(): EmailTemplateData {
    return { ...this.data };
  }
}
