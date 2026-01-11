import { Node, mergeAttributes } from '@tiptap/core';

export interface AppointmentBookingOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    appointmentBooking: {
      /**
       * Insert an appointment booking widget at current cursor position
       */
      insertAppointmentBooking: () => ReturnType;
      /**
       * Remove the selected appointment booking node
       */
      removeAppointmentBooking: () => ReturnType;
    };
  }
}

export const AppointmentBooking = Node.create<AppointmentBookingOptions>({
  name: 'appointmentBooking',

  group: 'block',

  atom: true,

  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      title: {
        default: 'Prendre rendez-vous',
        parseHTML: (element) =>
          element.getAttribute('data-title') || 'Prendre rendez-vous',
        renderHTML: (attributes) => ({
          'data-title': attributes.title,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div.appointment-booking',
      },
    ];
  },

  renderHTML({ node }) {
    const { title } = node.attrs;

    const attrs = mergeAttributes(this.options.HTMLAttributes, {
      class: 'appointment-booking',
      'data-title': title,
    });

    return [
      'div',
      attrs,
      ['div', { class: 'appointment-booking-placeholder' }, `📅 ${title}`],
    ];
  },

  addCommands() {
    return {
      insertAppointmentBooking:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              title: 'Prendre rendez-vous',
            },
          });
        },

      removeAppointmentBooking:
        () =>
        ({ commands }) => {
          return commands.deleteSelection();
        },
    };
  },
});

export default AppointmentBooking;
