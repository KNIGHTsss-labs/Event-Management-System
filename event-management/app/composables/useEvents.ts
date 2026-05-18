import type { AppEvent, CreateEventInput, UpdateEventInput, EventFilters } from '~~/app/types/event'

export const useEvents = () => {
  const filters = reactive<EventFilters>({
    name: '', date: '', status: '',
    sortBy: 'date', order: 'asc'
  })

  const { data: events, refresh } = useFetch<AppEvent[]>('/api/events', {
    query: filters,
    watch: [filters],
    default: () => []
  })

  const createEvent = (body: CreateEventInput) =>
    $fetch<AppEvent>('/api/events', { method: 'POST', body })

  const updateEvent = (id: string, body: UpdateEventInput) =>
    $fetch<AppEvent>(`/api/events/${id}`, { method: 'PUT', body })

  const deleteEvent = (id: string) =>
    $fetch(`/api/events/${id}`, { method: 'DELETE' })

  const updateCount = (id: string, delta: 1 | -1) =>
    $fetch<AppEvent>(`/api/events/${id}/participants`, { method: 'PATCH', body: { delta } })

  return { events, filters, refresh,
           createEvent, updateEvent, deleteEvent, updateCount }
}