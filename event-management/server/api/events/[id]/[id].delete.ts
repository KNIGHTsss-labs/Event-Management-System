import { db } from "~~/server/db/client"
import { events } from "~~/server/db/schema"
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {

    //auto route delete, id from param
    const id = getRouterParam(event, 'id')!
    await db.delete(events).where(eq(events.id, id))
    return { success: true}
})