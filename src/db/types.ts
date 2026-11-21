// Single source of truth for the enum-like text columns in schema.ts: each
// const array feeds a Drizzle `text({ enum: [...] })` column (compile-time
// narrowing) and a shared type for use in zod schemas and UI code later.

export const USER_ROLES = ['worker', 'supervisor'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const REPORT_TYPES = ['incident', 'inspection'] as const;
export type ReportType = (typeof REPORT_TYPES)[number];

export const REPORT_STATUSES = ['draft', 'queued', 'syncing', 'synced', 'failed'] as const;
export type ReportStatus = (typeof REPORT_STATUSES)[number];

export const INCIDENT_CATEGORIES = [
  'Injury',
  'Near miss',
  'Hazard',
  'Equipment or property damage',
  'Vehicle or mobile plant',
  'Environmental',
  'Fire',
  'Other',
] as const;
export type IncidentCategory = (typeof INCIDENT_CATEGORIES)[number];

export const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'] as const;
export type Severity = (typeof SEVERITIES)[number];

export const INSPECTION_RESULTS = ['no_issues', 'issues_found'] as const;
export type InspectionResult = (typeof INSPECTION_RESULTS)[number];

// Not specified in CLAUDE.md/requirements.md — report.status covers the
// report-level lifecycle, but per-photo upload needs its own smaller state
// machine (US-17: "photos upload separately and resume after interruptions").
// Flagging this as my own addition rather than a documented contract.
export const PHOTO_UPLOAD_STATUSES = ['pending', 'uploading', 'uploaded', 'failed'] as const;
export type PhotoUploadStatus = (typeof PHOTO_UPLOAD_STATUSES)[number];
