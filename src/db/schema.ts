import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import {
  USER_ROLES,
  REPORT_TYPES,
  REPORT_STATUSES,
  INCIDENT_CATEGORIES,
  SEVERITIES,
  INSPECTION_RESULTS,
  PHOTO_UPLOAD_STATUSES,
} from './types';

// Cached copy of the signed-in worker's profile (seeded server-side; the
// phone never writes this table). site_ids is JSON-encoded since SQLite has
// no array type — same logical field as the Postgres text[] column.
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  role: text('role', { enum: USER_ROLES }).notNull(),
  siteIds: text('site_ids', { mode: 'json' }).$type<string[]>().notNull(),
});

export const sites = sqliteTable('sites', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
});

// Incident and inspection reports share this table; fields unused by a given
// type stay null (see CLAUDE.md data model). id/ is a UUID assigned on the
// phone before insert, never server-generated.
export const reports = sqliteTable('reports', {
  id: text('id').primaryKey(),
  type: text('type', { enum: REPORT_TYPES }).notNull(),
  siteId: text('site_id')
    .notNull()
    .references(() => sites.id),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),

  // Incident fields
  category: text('category', { enum: INCIDENT_CATEGORIES }),
  severity: text('severity', { enum: SEVERITIES }),
  peopleInvolved: text('people_involved'),

  // Inspection fields
  area: text('area'),
  inspectionResult: text('inspection_result', { enum: INSPECTION_RESULTS }),

  // Shared
  occurredAt: integer('occurred_at', { mode: 'timestamp_ms' }).notNull(),
  description: text('description'),

  // Location (US-07)
  latitude: real('latitude'),
  longitude: real('longitude'),
  locationAccuracyM: real('location_accuracy_m'),
  locationText: text('location_text'),

  suggestedCategory: text('suggested_category', { enum: INCIDENT_CATEGORIES }),
  suggestionConfidence: real('suggestion_confidence'),
  modelVersion: text('model_version'),

  // Sync lifecycle (US-17 to US-20) — status exists only on the phone
  status: text('status', { enum: REPORT_STATUSES }).notNull().default('draft'),
  syncAttempts: integer('sync_attempts').notNull().default(0),
  lastError: text('last_error'),

  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  syncedAt: integer('synced_at', { mode: 'timestamp_ms' }),
});

export const photos = sqliteTable('photos', {
  id: text('id').primaryKey(),
  reportId: text('report_id')
    .notNull()
    .references(() => reports.id, { onDelete: 'cascade' }),
  localUri: text('local_uri').notNull(),
  remotePath: text('remote_path'),
  width: integer('width'),
  height: integer('height'),
  brightnessScore: real('brightness_score'),
  sharpnessScore: real('sharpness_score'),
  lowQuality: integer('low_quality', { mode: 'boolean' }).notNull().default(false),
  uploadStatus: text('upload_status', { enum: PHOTO_UPLOAD_STATUSES }).notNull().default('pending'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
});
