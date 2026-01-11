export class AppointmentEmailHelper {
  static formatDate(date: Date): string {
    const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return dateFormatter.format(date);
  }

  static formatTime(date: Date): string {
    const timeFormatter = new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return timeFormatter.format(date);
  }

  static replaceTemplateVariables(
    subject: string,
    body: string,
    variables: Record<string, string>
  ): { subject: string; body: string } {
    let processedSubject = subject;
    let processedBody = body;

    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(key, 'g');
      processedSubject = processedSubject.replace(regex, value);
      processedBody = processedBody.replace(regex, value);
    });

    return {
      subject: processedSubject,
      body: processedBody,
    };
  }
}
