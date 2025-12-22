'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Table,
  Badge,
  Spinner,
  Button,
  NativeSelect,
} from '@chakra-ui/react';
import { FiRefreshCw, FiMail, FiAlertCircle } from 'react-icons/fi';
import { formatDateTimeFr } from '@/presentation/shared/utils/formatDate';

interface EmailLog {
  id: string;
  orderId: string;
  type: 'admin' | 'purchaser';
  recipient: string;
  subject: string;
  status: 'sent' | 'failed';
  errorMessage: string | null;
  sentAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface EmailLogsResponse {
  logs: EmailLog[];
  pagination: PaginationInfo;
}

export default function EmailLogsDisplay(): React.ReactElement {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'sent' | 'failed'>(
    'all'
  );
  const [currentPage, setCurrentPage] = useState(1);

  const fetchLogs = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        status: statusFilter,
      });

      const response = await fetch(`/api/admin/email/logs?${params}`);

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des logs');
      }

      const data: EmailLogsResponse = await response.json();
      setLogs(data.logs);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const getTypeLabel = (type: 'admin' | 'purchaser'): string => {
    return type === 'admin' ? 'Administrateur' : 'Client';
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={6}
      bg="bg.panel"
      borderColor="border.emphasized"
    >
      <VStack gap={4} align="stretch">
        <HStack justify="space-between" wrap="wrap" gap={2}>
          <HStack gap={2}>
            <FiMail />
            <Text fontWeight="semibold" fontSize="lg">
              Historique des emails
            </Text>
          </HStack>

          <HStack gap={2}>
            <NativeSelect.Root size="sm" width="150px">
              <NativeSelect.Field
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as 'all' | 'sent' | 'failed')
                }
              >
                <option value="all">Tous</option>
                <option value="sent">Envoyés</option>
                <option value="failed">Échecs</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>

            <Button size="sm" variant="outline" onClick={fetchLogs}>
              <FiRefreshCw />
            </Button>
          </HStack>
        </HStack>

        {loading ? (
          <Box textAlign="center" py={8}>
            <Spinner size="lg" />
            <Text mt={2} color="fg.muted">
              Chargement...
            </Text>
          </Box>
        ) : error ? (
          <Box textAlign="center" py={8}>
            <HStack justify="center" color="red.500" gap={2}>
              <FiAlertCircle />
              <Text>{error}</Text>
            </HStack>
          </Box>
        ) : logs.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Text color="fg.muted">Aucun email envoyé</Text>
          </Box>
        ) : (
          <>
            <Table.ScrollArea>
              <Table.Root size="sm" variant="outline">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader>Date</Table.ColumnHeader>
                    <Table.ColumnHeader>Type</Table.ColumnHeader>
                    <Table.ColumnHeader>Destinataire</Table.ColumnHeader>
                    <Table.ColumnHeader>Sujet</Table.ColumnHeader>
                    <Table.ColumnHeader>Statut</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {logs.map((log) => (
                    <Table.Row key={log.id}>
                      <Table.Cell whiteSpace="nowrap">
                        {formatDateTimeFr(log.sentAt)}
                      </Table.Cell>
                      <Table.Cell>{getTypeLabel(log.type)}</Table.Cell>
                      <Table.Cell>
                        <Text truncate maxW="200px" title={log.recipient}>
                          {log.recipient}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text truncate maxW="250px" title={log.subject}>
                          {log.subject}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        {log.status === 'sent' ? (
                          <Badge colorPalette="green" variant="solid">
                            Envoyé
                          </Badge>
                        ) : (
                          <Badge
                            colorPalette="red"
                            variant="solid"
                            title={log.errorMessage || 'Erreur inconnue'}
                          >
                            Échec
                          </Badge>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>

            {pagination && pagination.totalPages > 1 && (
              <HStack justify="center" gap={2}>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Précédent
                </Button>
                <Text fontSize="sm" color="fg.muted">
                  Page {pagination.page} sur {pagination.totalPages}
                </Text>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage >= pagination.totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Suivant
                </Button>
              </HStack>
            )}
          </>
        )}
      </VStack>
    </Box>
  );
}
