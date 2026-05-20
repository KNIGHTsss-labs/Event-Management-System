import type { AppEvent, CreateEventInput, UpdateEventInput, EventFilters, EventsResponse } from '~~/app/types/event'

export const useEvents = () => {
  const filters = reactive<EventFilters>({
    name: '', date: '', dateFrom: '', dateTo: '',
    status: '', sortBy: 'date', order: 'asc',
    page: 1, limit: 10
  })

  const { data: response, refresh } = useFetch<EventsResponse>('/api/events', {
    query: filters,
    watch: [filters],
    default: () => ({ data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 1 } })
  })

  const events = computed(() => response.value?.data ?? [])
  const meta   = computed(() => response.value?.meta)

  watch(
    () => ({ 
    name: filters.name,
    date: filters.date,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    status: filters.status,
    sortBy: filters.sortBy,
    order: filters.order,
  }),
  async () => {
    await nextTick()
    filters.page = 1
  }
)

  const createEvent = (body: CreateEventInput) =>
    $fetch<AppEvent>('/api/events', { method: 'POST', body })

  const updateEvent = (id: string, body: UpdateEventInput) =>
    $fetch<AppEvent>(`/api/events/${id}`, { method: 'PUT', body })

  const deleteEvent = (id: string) =>
    $fetch(`/api/events/${id}`, { method: 'DELETE' })

  const updateCount = (id: string, delta: 1 | -1) =>
    $fetch<AppEvent>(`/api/events/${id}/participants`, { method: 'PATCH', body: { delta } })

  return { events, meta, filters, refresh,
           createEvent, updateEvent, deleteEvent, updateCount }
}