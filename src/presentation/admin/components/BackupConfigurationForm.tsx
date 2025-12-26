'use client';

import { useState, useCallback, useEffect, memo } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Spinner,
  Input,
  Badge,
  Table,
  IconButton,
} from '@chakra-ui/react';
import {
  LuDatabase,
  LuClock,
  LuTrash2,
  LuRefreshCw,
  LuDownload,
  LuTriangleAlert,
  LuPower,
  LuPowerOff,
  LuArchive,
} from 'react-icons/lu';
import { useBackupConfiguration } from '@/presentation/admin/hooks/useBackupConfiguration';
import { useThemeColor } from '@/presentation/shared/hooks/useThemeColor';

interface RestoreConfirmState {
  backupId: string;
  step: 1 | 2;
}

const BackupConfigurationForm = memo((): React.ReactElement => {
  const {
    config,
    backups,
    isLoading,
    isSaving,
    error,
    updateConfig,
    createBackup,
    restoreBackup,
    deleteBackup,
  } = useBackupConfiguration();

  const { themeColor } = useThemeColor();

  const [restoreConfirm, setRestoreConfirm] =
    useState<RestoreConfirmState | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [localHour, setLocalHour] = useState(0);
  const [localRetention, setLocalRetention] = useState(7);

  const textColor = 'fg.muted';
  const isUpdating = isLoading || isSaving;

  useEffect(() => {
    if (config) {
      setLocalHour(config.scheduledHour);
      setLocalRetention(config.retentionCount);
    }
  }, [config]);

  const handleToggleEnabled = useCallback(async (): Promise<void> => {
    if (config) {
      await updateConfig({ enabled: !config.enabled });
    }
  }, [config, updateConfig]);

  const handleHourChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const value = event.target.value;
      if (value === '') {
        setLocalHour(0);
        return;
      }
      const hour = parseInt(value, 10);
      if (!isNaN(hour) && hour >= 0 && hour <= 23) {
        setLocalHour(hour);
      }
    },
    []
  );

  const handleHourBlur = useCallback(async (): Promise<void> => {
    if (config && localHour !== config.scheduledHour) {
      await updateConfig({ scheduledHour: localHour });
    }
  }, [localHour, config, updateConfig]);

  const handleRetentionChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const value = event.target.value;
      if (value === '') {
        setLocalRetention(1);
        return;
      }
      const retention = parseInt(value, 10);
      if (!isNaN(retention) && retention >= 1 && retention <= 30) {
        setLocalRetention(retention);
      }
    },
    []
  );

  const handleRetentionBlur = useCallback(async (): Promise<void> => {
    if (config && localRetention !== config.retentionCount) {
      await updateConfig({ retentionCount: localRetention });
    }
  }, [localRetention, config, updateConfig]);

  const handleCreateBackup = useCallback(async (): Promise<void> => {
    await createBackup();
  }, [createBackup]);

  const handleRestoreClick = useCallback((backupId: string): void => {
    setRestoreConfirm((prev) => {
      if (!prev || prev.backupId !== backupId) {
        return { backupId, step: 1 };
      }
      if (prev.step === 1) {
        return { backupId, step: 2 };
      }
      return prev;
    });
  }, []);

  const handleRestoreConfirm = useCallback(
    async (backupId: string): Promise<void> => {
      await restoreBackup(backupId);
      setRestoreConfirm(null);
    },
    [restoreBackup]
  );

  const handleRestoreCancel = useCallback((): void => {
    setRestoreConfirm(null);
  }, []);

  const handleDeleteClick = useCallback(
    async (backupId: string): Promise<void> => {
      if (deleteConfirmId === backupId) {
        await deleteBackup(backupId);
        setDeleteConfirmId(null);
      } else {
        setDeleteConfirmId(backupId);
      }
    },
    [deleteConfirmId, deleteBackup]
  );

  const handleDeleteCancel = useCallback((): void => {
    setDeleteConfirmId(null);
  }, []);

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} Go`;
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  if (isLoading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="lg" />
        <Text mt={4} color={textColor}>
          Chargement de la configuration...
        </Text>
      </Box>
    );
  }

  if (!config) {
    return (
      <Box p={3} borderRadius="md" bg="red.100" _dark={{ bg: 'red.900' }}>
        <Text color="red.600" _dark={{ color: 'red.200' }} fontSize="sm">
          Erreur lors du chargement de la configuration
        </Text>
      </Box>
    );
  }

  return (
    <VStack gap={6} align="stretch" data-testid="backup-configuration-form">
      {error && (
        <Box p={3} borderRadius="md" bg="red.100" _dark={{ bg: 'red.900' }}>
          <Text color="red.600" _dark={{ color: 'red.200' }} fontSize="sm">
            {error}
          </Text>
        </Box>
      )}

      {/* Enable/Disable Section */}
      <VStack gap={3} align="start" width="full">
        <HStack gap={2} align="center">
          <LuDatabase />
          <Text fontSize="md" fontWeight="medium" color={textColor}>
            Sauvegardes automatiques
          </Text>
          {isUpdating && (
            <Spinner
              size="sm"
              color="fg.muted"
              aria-label="Mise à jour des paramètres"
            />
          )}
        </HStack>

        <HStack gap={3}>
          <Button
            onClick={handleToggleEnabled}
            disabled={isUpdating}
            variant={config.enabled ? 'solid' : 'outline'}
            colorPalette={config.enabled ? 'green' : 'gray'}
            size="md"
            aria-label={
              config.enabled
                ? 'Désactiver les sauvegardes automatiques'
                : 'Activer les sauvegardes automatiques'
            }
            aria-pressed={config.enabled}
            data-testid="toggle-backup-button"
          >
            <HStack gap={2}>
              {config.enabled ? <LuPower /> : <LuPowerOff />}
              <Text>{config.enabled ? 'Activé' : 'Désactivé'}</Text>
            </HStack>
          </Button>
        </HStack>

        {config.lastBackupAt && (
          <Text fontSize="sm" color={textColor} opacity={0.7}>
            Dernière sauvegarde : {formatDate(config.lastBackupAt)}
          </Text>
        )}
      </VStack>

      {/* Schedule Configuration */}
      {config.enabled && (
        <VStack gap={4} align="start" width="full">
          <HStack gap={2} align="center">
            <LuClock />
            <Text fontSize="md" fontWeight="medium" color={textColor}>
              Heure de sauvegarde (0-23)
            </Text>
          </HStack>

          <Input
            type="number"
            min={0}
            max={23}
            value={localHour}
            onChange={handleHourChange}
            onBlur={handleHourBlur}
            disabled={isUpdating}
            width="100px"
            aria-label="Sélectionnez l'heure de sauvegarde (0-23)"
            data-testid="backup-hour-input"
          />

          <Text fontSize="sm" color={textColor} opacity={0.7}>
            Sauvegarde programmée à{' '}
            <Text as="span" fontWeight="bold">
              {config.scheduledHour.toString().padStart(2, '0')}:00
            </Text>{' '}
            ({config.timezone})
          </Text>

          <HStack gap={2} align="center" mt={2}>
            <LuArchive />
            <Text fontSize="md" fontWeight="medium" color={textColor}>
              Nombre de sauvegardes à conserver (1-30)
            </Text>
          </HStack>

          <Input
            type="number"
            min={1}
            max={30}
            value={localRetention}
            onChange={handleRetentionChange}
            onBlur={handleRetentionBlur}
            disabled={isUpdating}
            width="100px"
            aria-label="Nombre de sauvegardes à conserver"
            data-testid="retention-count-input"
          />
        </VStack>
      )}

      {/* Manual Backup */}
      <VStack gap={3} align="start" width="full">
        <HStack gap={2} align="center">
          <LuDownload />
          <Text fontSize="md" fontWeight="medium" color={textColor}>
            Sauvegarde manuelle
          </Text>
        </HStack>

        <Button
          onClick={handleCreateBackup}
          disabled={isUpdating}
          colorPalette={themeColor}
          size="md"
          data-testid="create-backup-button"
        >
          {isSaving ? <Spinner size="sm" mr={2} /> : null}
          Créer une sauvegarde
        </Button>
      </VStack>

      {/* Backup List */}
      <VStack gap={4} align="start" width="full">
        <HStack gap={2} align="center">
          <LuDatabase />
          <Text fontSize="md" fontWeight="medium" color={textColor}>
            Sauvegardes disponibles
          </Text>
          <Badge>{backups.length}</Badge>
        </HStack>

        {backups.length === 0 ? (
          <Text color={textColor} opacity={0.7}>
            Aucune sauvegarde disponible
          </Text>
        ) : (
          <Box width="full" overflowX="auto">
            <Table.Root size="sm" width="full">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Date</Table.ColumnHeader>
                  <Table.ColumnHeader>Taille</Table.ColumnHeader>
                  <Table.ColumnHeader>Statut</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right">
                    Actions
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {backups.map((backup) => (
                  <Table.Row key={backup.id}>
                    <Table.Cell>{formatDate(backup.createdAt)}</Table.Cell>
                    <Table.Cell>{formatSize(backup.sizeBytes)}</Table.Cell>
                    <Table.Cell>
                      <Badge
                        colorPalette={
                          backup.status === 'completed' ? 'green' : 'red'
                        }
                        variant="solid"
                      >
                        {backup.status === 'completed' ? 'Terminé' : 'Échec'}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell textAlign="right">
                      <HStack justify="flex-end" gap={1}>
                        {backup.status === 'completed' && (
                          <>
                            {restoreConfirm?.backupId === backup.id ? (
                              restoreConfirm.step === 1 ? (
                                <HStack gap={1}>
                                  <Button
                                    size="xs"
                                    colorPalette="orange"
                                    onClick={() =>
                                      handleRestoreClick(backup.id)
                                    }
                                  >
                                    Confirmer ?
                                  </Button>
                                  <Button
                                    size="xs"
                                    variant="outline"
                                    onClick={handleRestoreCancel}
                                  >
                                    Annuler
                                  </Button>
                                </HStack>
                              ) : (
                                <HStack gap={1}>
                                  <LuTriangleAlert color="orange" />
                                  <Button
                                    size="xs"
                                    colorPalette="red"
                                    onClick={() =>
                                      handleRestoreConfirm(backup.id)
                                    }
                                    disabled={isUpdating}
                                  >
                                    Restaurer
                                  </Button>
                                  <Button
                                    size="xs"
                                    variant="outline"
                                    onClick={handleRestoreCancel}
                                  >
                                    Annuler
                                  </Button>
                                </HStack>
                              )
                            ) : (
                              <IconButton
                                aria-label="Restaurer"
                                size="xs"
                                variant="solid"
                                colorPalette={themeColor}
                                onClick={() => handleRestoreClick(backup.id)}
                                disabled={isUpdating}
                              >
                                <LuRefreshCw />
                              </IconButton>
                            )}
                          </>
                        )}
                        {deleteConfirmId === backup.id ? (
                          <HStack gap={1}>
                            <Button
                              size="xs"
                              colorPalette="red"
                              onClick={() => handleDeleteClick(backup.id)}
                              disabled={isUpdating}
                            >
                              Supprimer
                            </Button>
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={handleDeleteCancel}
                            >
                              Annuler
                            </Button>
                          </HStack>
                        ) : (
                          <IconButton
                            aria-label="Supprimer"
                            size="xs"
                            variant="solid"
                            colorPalette="red"
                            onClick={() => handleDeleteClick(backup.id)}
                            disabled={isUpdating}
                          >
                            <LuTrash2 />
                          </IconButton>
                        )}
                      </HStack>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        )}
      </VStack>
    </VStack>
  );
});

BackupConfigurationForm.displayName = 'BackupConfigurationForm';

export { BackupConfigurationForm };
