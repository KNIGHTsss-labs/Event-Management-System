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

    // status filter
    if (q.status === 'upcoming')
        conditions.push(gte(events.date, new Date()))
    else if (q.status === 'today') {
        const today = new Date(); today.setHours(0,0,0,0)
        const tomorrow = new Date(today); tomorrow.setDate(today.getDate()+1)
        conditions.push(gte(events.date, today), lte(events.date ,tomorrow))
    } else if (q.status === 'past')
        conditions.push(lte(events.date, new Date()))

    // sorting
    const sortCol = q.sortBy === 'registeredCount' ? events.registeredCount : events.date
    const order = q.order === 'desc' ? desc(sortCol) : asc(sortCol)

    return db.select().from(events)
    .where(and(...conditions))
    .orderBy(order)
})