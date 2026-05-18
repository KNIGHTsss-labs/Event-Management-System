import type { EventRow } from '~~/server/db/schema'
import type { AppEvent } from '~~/app/types/event'

export function toEvent(row: EventRow): AppEvent {
  return {
    ...row,
    date: row.date.toISOString(),   // DB gives Date, API sends string
  }
}