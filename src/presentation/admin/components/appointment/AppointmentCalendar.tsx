'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
  Box,
  Spinner,
  Center,
  Text,
  VStack,
  HStack,
  Badge,
  CloseButton,
} from '@chakra-ui/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import type { EventClickArg, DatesSetArg } from '@fullcalendar/core';
import { useThemeColorContext } from '@/presentation/shared/contexts/ThemeColorContext';
import { toaster } from '@/presentation/shared/components/ui/toaster';
import {
  getAppointmentStatusLabel,
  getAppointmentStatusBadgeColor,
} from '@/presentation/shared/utils/appointmentStatus';
import {
  formatAppointmentDetailDateTime,
  formatTimeFr,
} from '@/presentation/shared/utils/formatDate';
import {
  DIMENSIONS,
  CALENDAR_COLORS,
} from '@/presentation/shared/constants/appointment';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  color: string;
  textColor?: string;
  display?: 'auto' | 'background';
  extendedProps: {
    activityId?: string;
    activityName?: string;
    clientInfo?: {
      name: string;
      email: string;
      phone?: string;
      address?: string;
      customField?: string;
    };
    status?: string;
    isAvailability?: boolean;
  };
}

interface SelectedAppointment {
  id: string;
  title: string;
  start: Date;
  end: Date;
  activityName: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientAddress?: string;
  clientCustomField?: string;
  status: string;
  position: { x: number; y: number };
}

const STATUS_COLORS = {
  cancelled: { bg: 'gray.400', text: 'gray.700' },
  pending: { opacity: 0.3 },
  confirmed: { opacity: 1 },
} as const;

const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getEventBackgroundColor = (
  status: string | undefined,
  baseColor: string
): string => {
  if (status === 'cancelled') {
    return STATUS_COLORS.cancelled.bg;
  }
  if (status === 'pending') {
    return hexToRgba(baseColor, STATUS_COLORS.pending.opacity);
  }
  return baseColor;
};

const getEventTextColor = (status: string | undefined): string => {
  if (status === 'cancelled') {
    return STATUS_COLORS.cancelled.text;
  }
  return 'white';
};

export function AppointmentCalendar(): React.ReactElement {
  const calendarRef = useRef<FullCalendar>(null);
  const calendarContainerRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] =
    useState<SelectedAppointment | null>(null);
  const { themeColor } = useThemeColorContext();

  // Force calendar to recalculate layout when container becomes visible or size changes
  useEffect(() => {
    if (!calendarContainerRef.current) {
      return;
    }

    const updateCalendarSize = (): void => {
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.updateSize();
      }
    };

    // Initial update with delay to ensure DOM is ready
    const initialTimer = setTimeout(updateCalendarSize, 100);

    // Use ResizeObserver to detect when the container becomes visible/changes size
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          updateCalendarSize();
          break;
        }
      }
    });

    resizeObserver.observe(calendarContainerRef.current);

    return () => {
      clearTimeout(initialTimer);
      resizeObserver.disconnect();
    };
  }, []);

  const fetchEvents = useCallback(
    async (start: Date, end: Date): Promise<void> => {
      setIsLoading(true);
      try {
        const [appointmentsResponse, availabilityResponse] = await Promise.all([
          fetch(
            `/api/appointments/calendar?start=${start.toISOString()}&end=${end.toISOString()}`
          ),
          fetch('/api/appointments/availability'),
        ]);

        if (appointmentsResponse.ok && availabilityResponse.ok) {
          const appointments: CalendarEvent[] =
            await appointmentsResponse.json();
          const availability = await availabilityResponse.json();

          // Convert availability slots to calendar events
          const availabilityEvents = generateAvailabilityEvents(
            availability.weeklySlots,
            availability.exceptions,
            start,
            end
          );

          setEvents([...appointments, ...availabilityEvents]);
        } else {
          toaster.error({
            title: 'Erreur',
            description: 'Impossible de charger les rendez-vous',
          });
        }
      } catch {
        toaster.error({
          title: 'Erreur',
          description: 'Impossible de charger les rendez-vous',
        });
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const generateAvailabilityEvents = (
    weeklySlots: Array<{
      dayOfWeek: number;
      startTime: string;
      endTime: string;
    }>,
    exceptions: Array<{ date: string; reason?: string }>,
    start: Date,
    end: Date
  ): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    const exceptionDates = new Set(
      exceptions.map((e) => new Date(e.date).toDateString())
    );

    // Generate events for each day in the visible range
    const current = new Date(start);
    while (current <= end) {
      const dayOfWeek = current.getDay();
      const dateStr = current.toDateString();

      // Skip exception dates
      if (exceptionDates.has(dateStr)) {
        current.setDate(current.getDate() + 1);
        continue;
      }

      // Find slots for this day of week
      const slots = weeklySlots.filter((slot) => slot.dayOfWeek === dayOfWeek);

      for (const slot of slots) {
        const [startHours, startMinutes] = slot.startTime
          .split(':')
          .map(Number);
        const [endHours, endMinutes] = slot.endTime.split(':').map(Number);

        const slotStart = new Date(current);
        slotStart.setHours(startHours, startMinutes, 0, 0);

        const slotEnd = new Date(current);
        slotEnd.setHours(endHours, endMinutes, 0, 0);

        events.push({
          id: `availability-${dateStr}-${slot.startTime}-${slot.endTime}`,
          title: 'Disponible',
          start: slotStart.toISOString(),
          end: slotEnd.toISOString(),
          color: CALENDAR_COLORS.AVAILABILITY_BACKGROUND,
          display: 'background',
          extendedProps: {
            isAvailability: true,
          },
        });
      }

      current.setDate(current.getDate() + 1);
    }

    return events;
  };

  const handleDatesSet = useCallback(
    (dateInfo: DatesSetArg): void => {
      fetchEvents(dateInfo.start, dateInfo.end);
    },
    [fetchEvents]
  );

  const handleEventClick = useCallback((clickInfo: EventClickArg): void => {
    const event = clickInfo.event;
    const clientInfo = event.extendedProps.clientInfo as {
      name: string;
      email: string;
      phone?: string;
      address?: string;
      customField?: string;
    };

    // Calculate safe position to keep popover within viewport
    const popoverWidth = DIMENSIONS.POPOVER_WIDTH;
    const popoverHeight = DIMENSIONS.POPOVER_HEIGHT;
    const margin = DIMENSIONS.POPOVER_MARGIN;

    let x = clickInfo.jsEvent.pageX;
    let y = clickInfo.jsEvent.pageY;

    // Adjust horizontal position if needed
    if (x + popoverWidth > window.innerWidth - margin) {
      x = window.innerWidth - popoverWidth - margin;
    }
    if (x < margin) {
      x = margin;
    }

    // Adjust vertical position if needed
    if (y + popoverHeight > window.innerHeight - margin) {
      y = window.innerHeight - popoverHeight - margin;
    }
    if (y < margin) {
      y = margin;
    }

    setSelectedAppointment({
      id: event.id,
      title: event.title,
      start: event.start || new Date(),
      end: event.end || new Date(),
      activityName: event.extendedProps.activityName,
      clientName: clientInfo.name,
      clientEmail: clientInfo.email,
      clientPhone: clientInfo.phone,
      clientAddress: clientInfo.address,
      clientCustomField: clientInfo.customField,
      status: event.extendedProps.status,
      position: {
        x: x,
        y: y,
      },
    });
  }, []);

  const handleCloseDetails = useCallback((): void => {
    setSelectedAppointment(null);
  }, []);

  const processedEvents = useMemo(
    () =>
      events.map((event) => ({
        ...event,
        backgroundColor: getEventBackgroundColor(
          event.extendedProps.status,
          event.color
        ),
        borderColor: event.color,
        textColor: getEventTextColor(event.extendedProps.status),
      })),
    [events]
  );

  return (
    <Box position="relative" minH="600px">
      {isLoading && (
        <Center
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="bg"
          zIndex={10}
        >
          <Spinner size="xl" />
        </Center>
      )}

      <Box
        ref={calendarContainerRef}
        className="appointment-calendar"
        w="100%"
        css={{
          '& .fc': {
            fontFamily: 'inherit',
          },
          '& .fc-toolbar-title': {
            textTransform: 'capitalize',
          },
          '& .fc-button': {
            backgroundColor: 'transparent',
            color: 'var(--chakra-colors-gray-900)',
            _dark: {
              color: 'var(--chakra-colors-gray-100)',
            },
            border: '1px solid',
            borderColor: `var(--chakra-colors-${themeColor}-solid)`,
            fontWeight: '500',
            '&:hover': {
              backgroundColor: `var(--chakra-colors-${themeColor}-subtle)`,
              borderColor: `var(--chakra-colors-${themeColor}-solid)`,
              color: 'var(--chakra-colors-gray-900)',
              _dark: {
                color: 'var(--chakra-colors-gray-100)',
              },
            },
            '&:focus': {
              boxShadow: `0 0 0 3px var(--chakra-colors-${themeColor}-subtle)`,
            },
            '&.fc-button-active': {
              backgroundColor: `var(--chakra-colors-${themeColor}-subtle)`,
              borderColor: `var(--chakra-colors-${themeColor}-solid)`,
              color: `var(--chakra-colors-gray-900)`,
              _dark: {
                color: 'var(--chakra-colors-gray-100)',
              },
              '&:hover': {
                backgroundColor: `var(--chakra-colors-${themeColor}-solid)`,
                borderColor: `var(--chakra-colors-${themeColor}-solid)`,
              },
            },
            '& .fc-icon': {
              color: 'inherit',
            },
          },
          '& .fc-button-group': {
            '& .fc-button': {
              borderRadius: '0',
            },
            '& .fc-button:first-child': {
              borderTopLeftRadius: '0.375rem',
              borderBottomLeftRadius: '0.375rem',
            },
            '& .fc-button:last-child': {
              borderTopRightRadius: '0.375rem',
              borderBottomRightRadius: '0.375rem',
            },
          },
          '& .fc-day-today': {
            backgroundColor: `var(--chakra-colors-${themeColor}-subtle) !important`,
          },
          '& .fc-col-header-cell': {
            backgroundColor: `var(--chakra-colors-gray-50)`,
            _dark: {
              backgroundColor: `var(--chakra-colors-gray-800)`,
            },
          },
          '& .fc-timegrid-slot': {
            borderColor: `var(--chakra-colors-gray-200)`,
            _dark: {
              borderColor: `var(--chakra-colors-gray-700)`,
            },
          },
          '& .fc-daygrid-day': {
            borderColor: `var(--chakra-colors-gray-200)`,
            _dark: {
              borderColor: `var(--chakra-colors-gray-700)`,
            },
          },
          '& .fc-event': {
            cursor: 'pointer',
            borderRadius: '4px',
          },
          '& .fc-event:hover': {
            opacity: 0.9,
          },
          '& .fc-daygrid-event': {
            padding: '2px 4px',
          },
          '& .fc-timegrid-event': {
            padding: '4px',
          },
          '& .fc-toolbar': {
            marginBottom: '1rem',
          },
        }}
      >
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          locale={frLocale}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          buttonText={{
            today: "Aujourd'hui",
            month: 'Mois',
            week: 'Semaine',
            day: 'Jour',
          }}
          events={processedEvents}
          eventClick={handleEventClick}
          datesSet={handleDatesSet}
          slotMinTime="07:00:00"
          slotMaxTime="21:00:00"
          allDaySlot={false}
          weekends={true}
          nowIndicator={true}
          height={700}
          stickyHeaderDates={true}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }}
          slotLabelFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }}
        />
      </Box>

      {selectedAppointment && (
        <Box
          position="fixed"
          left={selectedAppointment.position.x}
          top={selectedAppointment.position.y}
          bg="bg"
          borderRadius="lg"
          boxShadow="xl"
          p={4}
          minW="320px"
          maxW="400px"
          zIndex={20}
        >
          <HStack justify="space-between" mb={3}>
            <Text fontWeight="bold" fontSize="lg">
              Détails du rendez-vous
            </Text>
            <CloseButton onClick={handleCloseDetails} />
          </HStack>

          <VStack align="stretch" gap={3}>
            <Box>
              <Text fontWeight="medium">Activité</Text>
              <Text fontSize="sm" color="fg.muted">
                {selectedAppointment.activityName}
              </Text>
            </Box>

            <Box>
              <Text fontWeight="medium">Client</Text>
              <VStack align="start" gap={0}>
                <Text fontSize="sm" color="fg.muted">
                  {selectedAppointment.clientName}
                </Text>
                <Text fontSize="xs" color="fg.muted">
                  {selectedAppointment.clientEmail}
                </Text>
                {selectedAppointment.clientPhone && (
                  <Text fontSize="xs" color="fg.muted">
                    {selectedAppointment.clientPhone}
                  </Text>
                )}
                {selectedAppointment.clientAddress && (
                  <Text fontSize="xs" color="fg.muted">
                    {selectedAppointment.clientAddress}
                  </Text>
                )}
                {selectedAppointment.clientCustomField && (
                  <Text fontSize="xs" color="fg.muted">
                    {selectedAppointment.clientCustomField}
                  </Text>
                )}
              </VStack>
            </Box>

            <Box>
              <Text fontWeight="medium">Horaire</Text>
              <Text fontSize="sm" color="fg.muted">
                {formatAppointmentDetailDateTime(selectedAppointment.start)}
              </Text>
              <Text fontSize="xs" color="fg.muted">
                jusqu&apos;à {formatTimeFr(selectedAppointment.end)}
              </Text>
            </Box>

            <Box>
              <Text fontWeight="medium">Statut</Text>
              <Badge
                colorPalette={getAppointmentStatusBadgeColor(
                  selectedAppointment.status
                )}
                color="fg"
              >
                {getAppointmentStatusLabel(selectedAppointment.status)}
              </Badge>
            </Box>
          </VStack>
        </Box>
      )}
    </Box>
  );
}
