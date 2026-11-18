import type { eventRegistrationFields } from '@csweek/db';
import { MAX_REGISTRATION_UPLOAD_BYTES, REGISTRATION_UPLOAD_MIME_TYPES } from '../registration-uploads';

type RegistrationField = typeof eventRegistrationFields.$inferSelect;
const decimalNumber = /^-?(?:\d+(?:\.\d+)?|\.\d+)(?:[eE][+-]?\d+)?$/;
// Match the email syntax accepted by an HTML input of type email.
const email = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i;

export function readRegistrationForm(form: FormData, fields: RegistrationField[]) {
  const responses: Record<string, string | boolean> = Object.create(null);
  const pendingUploads: { fieldKey: string; file: File }[] = [];

  for (const { fieldKey, fieldType, label, isRequired, options } of fields) {
    const entries = form.getAll(fieldKey);
    if (entries.length > 1) return { error: `Submit only one answer for ${label}.` };
    const entry = entries[0];
    const requiredError = `${label} is required.`;

    if (fieldType === 'file') {
      if (entry === undefined || (entry instanceof File && !entry.name && !entry.size)) {
        if (isRequired) return { error: requiredError };
        continue;
      }
      if (!(entry instanceof File) || !entry.size || !REGISTRATION_UPLOAD_MIME_TYPES.includes(entry.type)) {
        return { error: `${label} must be a PNG, JPEG, WebP, HEIC, or HEIF image.` };
      }
      if (entry.size > MAX_REGISTRATION_UPLOAD_BYTES) return { error: `${label} must be 4 MB or smaller.` };
      pendingUploads.push({ fieldKey, file: entry });
      continue;
    }

    if (fieldType === 'checkbox') {
      if (entry !== undefined && entry !== 'on') return { error: `Use the checkbox for ${label}.` };
      if (isRequired && entry === undefined) return { error: requiredError };
      responses[fieldKey] = entry === 'on';
      continue;
    }

    if (entry === undefined) {
      if (isRequired) return { error: requiredError };
      continue;
    }
    if (typeof entry !== 'string') return { error: `${label} must be text.` };
    const value = fieldType === 'select' ? entry : entry.trim();
    if (!value && isRequired) return { error: requiredError };

    if (value) {
      if (fieldType === 'select' && (!Array.isArray(options) || !options.includes(value))) {
        return { error: `Choose an available option for ${label}.` };
      }
      if (fieldType === 'email' && !email.test(value)) return { error: `Enter a valid email address for ${label}.` };
      if (fieldType === 'number' && (!decimalNumber.test(value) || !Number.isFinite(Number(value)))) {
        return { error: `Enter a valid number for ${label}.` };
      }
    }
    responses[fieldKey] = value;
  }

  return { responses, pendingUploads };
}
