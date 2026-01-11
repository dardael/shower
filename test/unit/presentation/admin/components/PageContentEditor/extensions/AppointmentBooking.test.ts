/**
 * @jest-environment jsdom
 */
import { Editor } from '@tiptap/core';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { AppointmentBooking } from '@/presentation/admin/components/PageContentEditor/extensions/AppointmentBooking';

describe('AppointmentBooking Extension', () => {
  let editor: Editor;

  beforeEach(() => {
    editor = new Editor({
      extensions: [Document, Paragraph, Text, AppointmentBooking],
      content: '<p>Test content</p>',
    });
  });

  afterEach(() => {
    editor.destroy();
  });

  describe('Extension Configuration', () => {
    it('should be named appointmentBooking', () => {
      const extension = editor.extensionManager.extensions.find(
        (ext) => ext.name === 'appointmentBooking'
      );
      expect(extension).toBeDefined();
    });

    it('should be a block-level node', () => {
      const extension = editor.extensionManager.extensions.find(
        (ext) => ext.name === 'appointmentBooking'
      );
      // Check via the extension's config
      expect((extension?.config as { group?: string })?.group).toBe('block');
    });

    it('should be an atom (non-editable)', () => {
      const extension = editor.extensionManager.extensions.find(
        (ext) => ext.name === 'appointmentBooking'
      );
      expect((extension?.config as { atom?: boolean })?.atom).toBe(true);
    });

    it('should be draggable', () => {
      const extension = editor.extensionManager.extensions.find(
        (ext) => ext.name === 'appointmentBooking'
      );
      expect((extension?.config as { draggable?: boolean })?.draggable).toBe(
        true
      );
    });
  });

  describe('Attributes', () => {
    it('should have default title attribute', () => {
      editor.commands.insertAppointmentBooking();

      const node = editor.state.doc.firstChild;
      expect(node?.type.name).toBe('appointmentBooking');
      expect(node?.attrs.title).toBe('Prendre rendez-vous');
    });
  });

  describe('Commands', () => {
    it('should insert appointment booking node', () => {
      const result = editor.commands.insertAppointmentBooking();

      expect(result).toBe(true);
      expect(editor.getHTML()).toContain('appointment-booking');
    });

    it('should remove appointment booking node when selected', () => {
      editor.commands.insertAppointmentBooking();

      // Select the inserted node
      editor.commands.selectAll();

      const result = editor.commands.removeAppointmentBooking();

      expect(result).toBe(true);
    });
  });

  describe('HTML Parsing', () => {
    it('should parse appointment-booking div from HTML', () => {
      const html =
        '<div class="appointment-booking" data-title="Réservez maintenant"></div>';

      const parseEditor = new Editor({
        extensions: [Document, Paragraph, Text, AppointmentBooking],
        content: html,
      });

      const node = parseEditor.state.doc.firstChild;
      expect(node?.type.name).toBe('appointmentBooking');
      expect(node?.attrs.title).toBe('Réservez maintenant');

      parseEditor.destroy();
    });

    it('should use default title when data-title is missing', () => {
      const html = '<div class="appointment-booking"></div>';

      const parseEditor = new Editor({
        extensions: [Document, Paragraph, Text, AppointmentBooking],
        content: html,
      });

      const node = parseEditor.state.doc.firstChild;
      expect(node?.attrs.title).toBe('Prendre rendez-vous');

      parseEditor.destroy();
    });
  });

  describe('HTML Rendering', () => {
    it('should render with appointment-booking class', () => {
      editor.commands.insertAppointmentBooking();

      const html = editor.getHTML();
      expect(html).toContain('class="appointment-booking"');
    });

    it('should render with data-title attribute', () => {
      editor.commands.insertAppointmentBooking();

      const html = editor.getHTML();
      expect(html).toContain('data-title="Prendre rendez-vous"');
    });

    it('should render placeholder with emoji', () => {
      editor.commands.insertAppointmentBooking();

      const html = editor.getHTML();
      expect(html).toContain('📅');
      expect(html).toContain('Prendre rendez-vous');
    });
  });

  describe('Localization', () => {
    it('should use French default title', () => {
      editor.commands.insertAppointmentBooking();

      const node = editor.state.doc.firstChild;
      expect(node?.attrs.title).toBe('Prendre rendez-vous');
    });
  });
});
