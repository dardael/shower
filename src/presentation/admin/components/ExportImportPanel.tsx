'use client';

import { useRef } from 'react';
import { Box, Button, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { FiDownload, FiUpload } from 'react-icons/fi';
import { useExportConfiguration } from '../hooks/useExportConfiguration';
import { useImportConfiguration } from '../hooks/useImportConfiguration';
import { useDynamicTheme } from '@/presentation/shared/DynamicThemeProvider';

export function ExportImportPanel(): React.ReactElement {
  const { themeColor } = useDynamicTheme();
  const { isExporting, exportConfiguration } = useExportConfiguration();
  const {
    isImporting,
    isPreviewing,
    previewResult,
    previewConfiguration,
    importConfiguration,
    clearPreview,
  } = useImportConfiguration();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = event.target.files?.[0];
    if (file) {
      await previewConfiguration(file);
    }
  };

  const handleImportClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleConfirmImport = async (): Promise<void> => {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      await importConfiguration(file);
    }
  };

  const handleCancelImport = (): void => {
    clearPreview();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <VStack align="stretch" gap={6}>
      {/* Export Section */}
      <Box
        p={6}
        borderRadius="md"
        bg="bg.subtle"
        borderWidth="1px"
        borderColor="border"
      >
        <Heading size="md" mb={2}>
          Exporter la configuration
        </Heading>
        <Text color="fg.muted" mb={4}>
          Téléchargez une sauvegarde de la configuration de votre site incluant
          les éléments de menu, le contenu des pages, les paramètres et les
          images.
        </Text>
        <Button
          colorPalette={themeColor}
          onClick={exportConfiguration}
          loading={isExporting}
          loadingText="Exportation..."
        >
          <FiDownload />
          Exporter la configuration
        </Button>
      </Box>

      {/* Import Section */}
      <Box
        p={6}
        borderRadius="md"
        bg="bg.subtle"
        borderWidth="1px"
        borderColor="border"
      >
        <Heading size="md" mb={2}>
          Importer la configuration
        </Heading>
        <Text color="fg.muted" mb={4}>
          Restaurez la configuration de votre site à partir d&apos;une
          sauvegarde précédemment exportée. Cela remplacera toutes les données
          actuelles.
        </Text>

        <input
          ref={fileInputRef}
          type="file"
          accept=".zip"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {!previewResult && (
          <Button
            colorPalette={themeColor}
            onClick={handleImportClick}
            loading={isPreviewing}
            loadingText="Analyse..."
          >
            <FiUpload />
            Sélectionner un fichier
          </Button>
        )}

        {previewResult && previewResult.valid && previewResult.package && (
          <Box
            p={4}
            borderRadius="md"
            bg="bg"
            borderWidth="1px"
            borderColor="border.emphasized"
          >
            <Heading size="sm" mb={3}>
              Aperçu du package
            </Heading>
            <VStack align="stretch" gap={2} mb={4}>
              <Text fontSize="sm">
                <strong>Date d&apos;export :</strong>{' '}
                {new Date(previewResult.package.exportDate).toLocaleString()}
              </Text>
              <Text fontSize="sm">
                <strong>Version :</strong> {previewResult.package.schemaVersion}
              </Text>
              <Text fontSize="sm">
                <strong>Contenu :</strong>{' '}
                {previewResult.package.summary.menuItems} éléments de menu,{' '}
                {previewResult.package.summary.pageContents} pages,{' '}
                {previewResult.package.summary.settings} paramètres,{' '}
                {previewResult.package.summary.socialNetworks} réseaux sociaux,{' '}
                {previewResult.package.summary.images} images
              </Text>
            </VStack>
            <Text color="fg.warning" fontSize="sm" mb={4}>
              Attention : L&apos;importation remplacera toutes les données de
              configuration actuelles. Cette action est irréversible.
            </Text>
            <HStack gap={3}>
              <Button
                colorPalette={themeColor}
                onClick={handleConfirmImport}
                loading={isImporting}
                loadingText="Importation..."
              >
                Confirmer l&apos;import
              </Button>
              <Button
                colorPalette={themeColor}
                variant="outline"
                onClick={handleCancelImport}
                disabled={isImporting}
              >
                Annuler
              </Button>
            </HStack>
          </Box>
        )}

        {previewResult && !previewResult.valid && (
          <Box
            p={4}
            borderRadius="md"
            bg="bg.error"
            borderWidth="1px"
            borderColor="border.error"
          >
            <Text color="fg.error" mb={3}>
              {previewResult.error ?? 'Package invalide'}
            </Text>
            <Button
              colorPalette={themeColor}
              variant="outline"
              onClick={handleCancelImport}
            >
              Essayer un autre fichier
            </Button>
          </Box>
        )}
      </Box>
    </VStack>
  );
}
