import { db } from '../db/client'
import { sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    try {
        const result = await db.execute(sql`SELECT 1 AS connected`)

        return {
            status: 'success',
            message: 'Connect completely!',
            data: result
        }
    }catch (error){
        return {
            status: 'error',
            message: 'Fail to connect database pls, recheck password in .env'
        }
    }
})