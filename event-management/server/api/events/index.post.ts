import { db } from '~~/server/db/client'
import { events } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {

    // validate required field (name, date, location)
    const body = await readBody(event)
    if (!body.name || !body.date || !body.location)
        throw createError({ statusCode: 400, message: 'Missing required fields' })
})