import { pgTable, uuid, text, boolean, integer, timestamp, jsonb, uniqueIndex, index, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  fullName: text('full_name'),
  role: text('role').notNull().default('participant'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  roleCheck: check('role_check', sql`${t.role} in ('participant','admin')`),
}));

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  startAt: timestamp('start_at', { withTimezone: true }).notNull(),
  endAt: timestamp('end_at', { withTimezone: true }),
  capacity: integer('capacity'),
  status: text('status').notNull().default('draft'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  statusCheck: check('status_check', sql`${t.status} in ('draft','open','closed')`),
  // Fast lookups for the public "open, upcoming events" query on the
  // homepage/events listing: WHERE status='open' AND start_at>=now() ORDER BY start_at
  statusStartIdx: index('events_status_start_at_idx').on(t.status, t.startAt),
}));

export const registrations = pgTable('registrations', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('pending'),
  responses: jsonb('responses').notNull().default(sql`'{}'::jsonb`),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  statusCheck: check('status_check', sql`${t.status} in ('pending','confirmed','cancelled')`),
  eventUserUnique: uniqueIndex('event_user_unique').on(t.eventId, t.userId),
  // Admin list/export: filter by status + order by created_at
  statusCreatedIdx: index('registrations_status_created_at_idx').on(t.status, t.createdAt),
}));

export const eventRegistrationFields = pgTable('event_registration_fields', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  fieldKey: text('field_key').notNull(),
  label: text('label').notNull(),
  fieldType: text('field_type').notNull(),
  options: jsonb('options'),
  isRequired: boolean('is_required').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  fieldTypeCheck: check('field_type_check', sql`${t.fieldType} in ('text','number','email','select','checkbox','file')`),
  eventFieldUnique: uniqueIndex('event_field_unique').on(t.eventId, t.fieldKey),
}));
