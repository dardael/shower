export type EmailTemplateType =
  | 'admin'
  | 'purchaser'
  | 'appointment-booking'
  | 'appointment-admin-confirmation'
  | 'appointment-admin-new'
  | 'appointment-reminder'
  | 'appointment-cancellation';

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

const DEFAULT_APPOINTMENT_BOOKING_SUBJECT =
  'Confirmation de rendez-vous: {{appointment_activity}}';
const DEFAULT_APPOINTMENT_BOOKING_BODY = `Bonjour {{customer_name}},

Votre rendez-vous a été confirmé!

Activité: {{appointment_activity}}
Date: {{appointment_date}}
Heure: {{appointment_time}}
Durée: {{appointment_duration}}

Détails du client:
Nom: {{customer_name}}
Email: {{customer_email}}
Téléphone: {{customer_phone}}
Notes: {{customer_notes}}

Cordialement,
L'équipe`;

const DEFAULT_APPOINTMENT_ADMIN_CONFIRMATION_SUBJECT =
  'Votre rendez-vous a été confirmé par notre équipe: {{appointment_activity}}';
const DEFAULT_APPOINTMENT_ADMIN_CONFIRMATION_BODY = `Bonjour {{customer_name}},

Bonne nouvelle! Votre rendez-vous a été confirmé par notre équipe.

Activité: {{appointment_activity}}
Date: {{appointment_date}}
Heure: {{appointment_time}}
Durée: {{appointment_duration}}

Votre rendez-vous est maintenant définitivement confirmé. Nous vous attendons avec plaisir!

Cordialement,
L'équipe`;

const DEFAULT_APPOINTMENT_REMINDER_SUBJECT =
  'Rappel: Rendez-vous {{appointment_activity}}';
const DEFAULT_APPOINTMENT_REMINDER_BODY = `Bonjour {{customer_name}},

Ceci est un rappel pour votre rendez-vous.

Activité: {{appointment_activity}}
Date: {{appointment_date}}
Heure: {{appointment_time}}
Durée: {{appointment_duration}}

À bientôt!`;

const DEFAULT_APPOINTMENT_CANCELLATION_SUBJECT =
  'Annulation de rendez-vous: {{appointment_activity}}';
const DEFAULT_APPOINTMENT_CANCELLATION_BODY = `Bonjour {{customer_name}},

Votre rendez-vous a été annulé.

Activité: {{appointment_activity}}
Date prévue: {{appointment_date}}
Heure prévue: {{appointment_time}}

Nous espérons vous revoir très prochainement.
Cordialement,
L'équipe`;

const DEFAULT_APPOINTMENT_ADMIN_NEW_SUBJECT =
  'Nouvelle réservation: {{appointment_activity}} - {{customer_name}}';
const DEFAULT_APPOINTMENT_ADMIN_NEW_BODY = `Nouvelle réservation de rendez-vous

Un nouveau rendez-vous a été réservé. Voici les détails :

Activité: {{appointment_activity}}
Date: {{appointment_date}}
Heure: {{appointment_time}}
Durée: {{appointment_duration}}

Client:
Nom: {{customer_name}}
Email: {{customer_email}}
Téléphone: {{customer_phone}}
Notes: {{customer_notes}}

Statut: En attente de confirmation

Connectez-vous à l'administration pour confirmer ou annuler ce rendez-vous.`;

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
    if (type === 'purchaser') {
      return new EmailTemplate({
        type: 'purchaser',
        subject: DEFAULT_PURCHASER_SUBJECT,
        body: DEFAULT_PURCHASER_BODY,
        enabled: false,
      });
    }
    if (type === 'appointment-booking') {
      return new EmailTemplate({
        type: 'appointment-booking',
        subject: DEFAULT_APPOINTMENT_BOOKING_SUBJECT,
        body: DEFAULT_APPOINTMENT_BOOKING_BODY,
        enabled: false,
      });
    }
    if (type === 'appointment-admin-confirmation') {
      return new EmailTemplate({
        type: 'appointment-admin-confirmation',
        subject: DEFAULT_APPOINTMENT_ADMIN_CONFIRMATION_SUBJECT,
        body: DEFAULT_APPOINTMENT_ADMIN_CONFIRMATION_BODY,
        enabled: false,
      });
    }
    if (type === 'appointment-reminder') {
      return new EmailTemplate({
        type: 'appointment-reminder',
        subject: DEFAULT_APPOINTMENT_REMINDER_SUBJECT,
        body: DEFAULT_APPOINTMENT_REMINDER_BODY,
        enabled: false,
      });
    }
    if (type === 'appointment-admin-new') {
      return new EmailTemplate({
        type: 'appointment-admin-new',
        subject: DEFAULT_APPOINTMENT_ADMIN_NEW_SUBJECT,
        body: DEFAULT_APPOINTMENT_ADMIN_NEW_BODY,
        enabled: false,
      });
    }
    return new EmailTemplate({
      type: 'appointment-cancellation',
      subject: DEFAULT_APPOINTMENT_CANCELLATION_SUBJECT,
      body: DEFAULT_APPOINTMENT_CANCELLATION_BODY,
      enabled: false,
    });
  }

  private static validate(data: EmailTemplateData): void {
    if (
      data.type !== 'admin' &&
      data.type !== 'purchaser' &&
      data.type !== 'appointment-booking' &&
      data.type !== 'appointment-admin-confirmation' &&
      data.type !== 'appointment-admin-new' &&
      data.type !== 'appointment-reminder' &&
      data.type !== 'appointment-cancellation'
    ) {
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
