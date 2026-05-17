import { pgTable, uuid, varchar, text, timestamp, integer } from 'drizzle-orm/pg-core'

export const events = pgTable('events', {
  id:               uuid('id').primaryKey().defaultRandom(),
  name:             varchar('name', { length: 255 }).notNull(),
  description:      text('description'),
  date:             timestamp('date').notNull(),
  location:         varchar('location', { length: 255 }).notNull(),
  maxParticipants:  integer('max_participants'),
  registeredCount:  integer('registered_count').default(0).notNull(),
})