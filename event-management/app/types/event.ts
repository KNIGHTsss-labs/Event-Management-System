export interface AppEvent {
  id: string
  name: string
  description: string | null
  date: string          // ISO string — dates serialize as strings over the wire
  location: string
  maxParticipants: number | null
  registeredCount: number
}

export type CreateEventInput = Omit<AppEvent, 'id' | 'registeredCount'>

export type UpdateEventInput = Partial<CreateEventInput>

export interface EventFilters {
  name?: string
  date?: string
  status?: 'upcoming' | 'today' | 'past' | ''
  sortBy?: 'date' | 'registeredCount'
  order?: 'asc' | 'desc'
}