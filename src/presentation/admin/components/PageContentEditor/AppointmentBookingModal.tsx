'use client';

import { useState, useEffect } from 'react';
import { Box, Button, Input, Text, VStack, HStack } from '@chakra-ui/react';
import type { Editor } from '@tiptap/core';
import { useThemeColor } from '@/presentation/shared/hooks/useThemeColor';
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
} from '@chakra-ui/react';

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor | null;
  currentTitle?: string;
}

export function AppointmentBookingModal({
  isOpen,
  onClose,
  editor,
  currentTitle = 'Prendre rendez-vous',
}: AppointmentBookingModalProps): React.ReactElement {
  const { themeColor } = useThemeColor();
  const [title, setTitle] = useState(currentTitle);

  useEffect(() => {
    if (isOpen) {
      setTitle(currentTitle);
    }
  }, [isOpen, currentTitle]);

  const handleInsert = (): void => {
    if (!editor) return;

    editor.commands.insertContent({
      type: 'appointmentBooking',
      attrs: {
        title,
      },
    });

    onClose();
    setTitle('Prendre rendez-vous');
  };

  const handleClose = (): void => {
    onClose();
    setTitle('Prendre rendez-vous');
  };

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(details: { open: boolean }) =>
        !details.open && handleClose()
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insérer un widget de réservation</DialogTitle>
        </DialogHeader>
        <DialogCloseTrigger />

        <DialogBody>
          <VStack gap={4} align="stretch">
            <Box>
              <Text mb={2} fontWeight="medium">
                Titre du widget
              </Text>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Prendre rendez-vous"
              />
              <Text fontSize="sm" color="fg.muted" mt={1}>
                Ce titre sera affiché au-dessus du formulaire de réservation
              </Text>
            </Box>

            <Box p={4} borderWidth="1px" borderRadius="md" bg="bg.subtle">
              <Text fontWeight="medium" mb={2}>
                Aperçu
              </Text>
              <Box
                p={4}
                borderWidth="1px"
                borderRadius="md"
                bg="bg.subtle"
                textAlign="center"
              >
                <Text fontSize="lg">📅 {title || 'Prendre rendez-vous'}</Text>
                <Text fontSize="sm" color="fg.muted" mt={2}>
                  Le widget de réservation sera affiché ici
                </Text>
              </Box>
            </Box>
          </VStack>
        </DialogBody>

        <DialogFooter>
          <HStack gap={3}>
            <Button variant="ghost" onClick={handleClose}>
              Annuler
            </Button>
            <Button colorPalette={themeColor} onClick={handleInsert}>
              Insérer
            </Button>
          </HStack>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
