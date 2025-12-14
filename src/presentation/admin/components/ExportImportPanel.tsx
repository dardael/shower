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
          Export Configuration
        </Heading>
        <Text color="fg.muted" mb={4}>
          Download a backup of your website configuration including menu items,
          page contents, settings, and images.
        </Text>
        <Button
          colorPalette={themeColor}
          onClick={exportConfiguration}
          loading={isExporting}
          loadingText="Exporting..."
        >
          <FiDownload />
          Export Configuration
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
          Import Configuration
        </Heading>
        <Text color="fg.muted" mb={4}>
          Restore your website configuration from a previously exported backup.
          This will replace all current data.
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
            loadingText="Analyzing..."
          >
            <FiUpload />
            Select File to Import
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
              Package Preview
            </Heading>
            <VStack align="stretch" gap={2} mb={4}>
              <Text fontSize="sm">
                <strong>Export Date:</strong>{' '}
                {new Date(previewResult.package.exportDate).toLocaleString()}
              </Text>
              <Text fontSize="sm">
                <strong>Version:</strong> {previewResult.package.schemaVersion}
              </Text>
              <Text fontSize="sm">
                <strong>Contents:</strong>{' '}
                {previewResult.package.summary.menuItems} menu items,{' '}
                {previewResult.package.summary.pageContents} pages,{' '}
                {previewResult.package.summary.settings} settings,{' '}
                {previewResult.package.summary.socialNetworks} social networks,{' '}
                {previewResult.package.summary.images} images
              </Text>
            </VStack>
            <Text color="fg.warning" fontSize="sm" mb={4}>
              Warning: Importing will replace all current configuration data.
              This action cannot be undone.
            </Text>
            <HStack gap={3}>
              <Button
                colorPalette={themeColor}
                onClick={handleConfirmImport}
                loading={isImporting}
                loadingText="Importing..."
              >
                Confirm Import
              </Button>
              <Button
                colorPalette={themeColor}
                variant="outline"
                onClick={handleCancelImport}
                disabled={isImporting}
              >
                Cancel
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
              {previewResult.error ?? 'Invalid package'}
            </Text>
            <Button
              colorPalette={themeColor}
              variant="outline"
              onClick={handleCancelImport}
            >
              Try Another File
            </Button>
          </Box>
        )}
      </Box>
    </VStack>
  );
}
