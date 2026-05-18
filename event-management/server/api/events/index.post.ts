import { db } from '~~/server/db/client'
import { events } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {

    // validate required field (name, date, location)
    const body = await readBody(event)
    if (!body.name || !body.date || !body.location)
        throw createError({ statusCode: 400, message: 'Missing required fields' })

    // insert & return created rows
    const [created] = await db.insert(events).values({
        name: body.name,
        description: body.description ?? null,
        date: new Date(body.date),
        location: body.location,
        maxParticipants: body.maxParticipants ?? null,
    }).returning()
    return created
})