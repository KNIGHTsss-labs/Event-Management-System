import { db } from '~~/server/db/client'
import { events } from '~~/server/db/schema'
import { ilike, gte, lte, and, asc, desc, count } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const q = getQuery(event)
    const conditions = []

    // search event name
    if (q.name)
        conditions.push(ilike(events.name, `%${q.name}%`))

    // date range picker
    if (q.dateFrom && q.dateTo) {
        conditions.push(
            gte(events.date, new Date(q.dateFrom as string)),
            lte(events.date, new Date(q.dateTo as string))
        )
    }else if (q.date) { // date filter
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

    // pagination
    const page = Math.max(1, Number(q.page) || 1)
    const limit = Math.min(50, Number(q.limit) || 10)
    const offset = (page - 1) * limit

    const where = and(...conditions)

    const result = await db.select({ total: count() })
      .from(events).where(where)
    const total = result[0]?.total ?? 0
  

    const data = await db.select().from(events)
      .where(where)
      .orderBy(order)
      .limit(limit)
      .offset(offset)

    return {
        data,
        meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(Number(total) / limit)
        }
    }
})