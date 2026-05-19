import { db } from "~~/server/db/client"
import { events } from "~~/server/db/schema"
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {

    //auto route edit, id from param
    const id = getRouterParam(event, 'id')!
    const body = await readBody(event)
    const [update] = await db.update(events)
    .set({ ...body, date: new Date(body.date)})
    .where(eq(events.id, id))
    .returning()
    if (!update) throw createError({ status: 404})
    return update
})