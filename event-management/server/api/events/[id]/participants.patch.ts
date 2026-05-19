import { db } from "~~/server/db/client"
import { events } from "~~/server/db/schema"
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {

    //auto route patch, id from param
    const id = getRouterParam(event, 'id')!
    const { delta } = await readBody(event) // +1 or -1

    const [row] = await db.select().from(events).where(eq(events.id, id))
    if (!row) throw createError({ status: 404 })

    const next = row.registeredCount + delta

    if (next < 0)
        throw createError({ status: 400, message: 'Count cannot be negative.'})

    if (row.maxParticipants !== null && next > row.maxParticipants)
        throw createError({ status: 400, message: 'Event is full.'})

    const [updated] = await db.update(events)
    .set({ registeredCount: next })
    .where(eq(events.id, id))
    .returning()
    return updated
})