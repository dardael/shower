'use client';

import { useState, useEffect, useCallback } from 'react';

interface BackupConfiguration {
  enabled: boolean;
  scheduledHour: number;
  retentionCount: number;
  timezone: string;
  lastBackupAt: Date | null;
}

interface DatabaseBackup {
  id: string;
  filePath: string;
  createdAt: Date;
  sizeBytes: number;
  status: 'completed' | 'failed';
  error?: string;
}

interface UseBackupConfigurationResult {
  config: BackupConfiguration | null;
  backups: DatabaseBackup[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  updateConfig: (updates: Partial<BackupConfiguration>) => Promise<void>;
  createBackup: () => Promise<void>;
  restoreBackup: (backupId: string) => Promise<void>;
  deleteBackup: (backupId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useBackupConfiguration(): UseBackupConfigurationResult {
  const [config, setConfig] = useState<BackupConfiguration | null>(null);
  const [backups, setBackups] = useState<DatabaseBackup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch('/api/backup/configuration');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement de la configuration');
      }
      const data = await response.json();
      setConfig({
        ...data,
        lastBackupAt: data.lastBackupAt ? new Date(data.lastBackupAt) : null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  }, []);

  const fetchBackups = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch('/api/backup');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des sauvegardes');
      }
      const data = await response.json();
      setBackups(
        data.backups.map((backup: DatabaseBackup) => ({
          ...backup,
          createdAt: new Date(backup.createdAt),
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  }, []);

  const refresh = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    await Promise.all([fetchConfig(), fetchBackups()]);
    setIsLoading(false);
  }, [fetchConfig, fetchBackups]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateConfig = useCallback(
    async (updates: Partial<BackupConfiguration>): Promise<void> => {
      setIsSaving(true);
      setError(null);
      try {
        const response = await fetch('/api/backup/configuration', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erreur lors de la mise à jour');
        }
        const data = await response.json();
        setConfig({
          ...data,
          lastBackupAt: data.lastBackupAt ? new Date(data.lastBackupAt) : null,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  const createBackup = useCallback(async (): Promise<void> => {
    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch('/api/backup', {
        method: 'POST',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || 'Erreur lors de la création de la sauvegarde'
        );
      }
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [refresh]);

  const restoreBackup = useCallback(
    async (backupId: string): Promise<void> => {
      setIsSaving(true);
      setError(null);
      try {
        const response = await fetch(`/api/backup/${backupId}/restore`, {
          method: 'POST',
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erreur lors de la restauration');
        }
        await refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [refresh]
  );

  const deleteBackup = useCallback(
    async (backupId: string): Promise<void> => {
      setIsSaving(true);
      setError(null);
      try {
        const response = await fetch(`/api/backup/${backupId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erreur lors de la suppression');
        }
        await refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [refresh]
  );

  return {
    config,
    backups,
    isLoading,
    isSaving,
    error,
    updateConfig,
    createBackup,
    restoreBackup,
    deleteBackup,
    refresh,
  };
}
