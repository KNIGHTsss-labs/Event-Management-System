import { db } from "~~/server/db/client"
import { events } from "~~/server/db/schema"
import {eq} from 'drizzle-orm'

export default defineEventHandler(async (event) => {

    //auto route get id from param
    const id = getRouterParam(event, 'id')!
    const [row] = await db.select().from(events)
    .where(eq(events.id, id))
    if (!row) throw createError({ status: 404 })
    return row
})