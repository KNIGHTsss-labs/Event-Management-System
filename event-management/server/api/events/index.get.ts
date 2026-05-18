import { db } from '~~/server/db/client'
import { events } from '~~/server/db/schema'
import { ilike, eq, gte, lte, and, asc, desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const q = getQuery(event)
    const conditions = []

    // search event name
    if (q.name)
        conditions.push(ilike(events.name, `%${q.name}%`))
})