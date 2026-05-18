import { db } from '~~/server/db/client'
import { events } from '~~/server/db/schema'
import { ilike, eq, gte, lte, and, asc, desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const q = getQuery(event)
    const conditions = []

    // search event name
    if (q.name)
        conditions.push(ilike(events.name, `%${q.name}%`))

    // date filter
    if (q.date) {
        const d = new Date(q.date as string)
        const next = new Date(d); next.setDate(d.getDate() + 1)
        conditions.push(gte(events.date, d), lte(events.date, next))
    }
})