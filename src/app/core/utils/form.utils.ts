import { AbstractControl, Validators } from '@angular/forms';

/** Digits only, length 1–28 */
export const PHONE_PATTERN = /^[0-9]{1,28}$/;

/** Digits only when filled, length 0–28 (optional fields) */
export const PHONE_PATTERN_OPTIONAL = /^[0-9]{0,28}$/;

export const PHONE_MAX_LENGTH = 28;

export function phoneValidators(required = true) {
  const validators = [
    Validators.pattern(required ? PHONE_PATTERN : PHONE_PATTERN_OPTIONAL),
    Validators.maxLength(PHONE_MAX_LENGTH),
  ];
  if (required) {
    validators.unshift(Validators.required);
    validators.push(Validators.minLength(1));
  }
  return validators;
}

/** Start of today in local timezone (safe for datepicker [min]) */
export function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Format a Date (or date-like value) as YYYY-MM-DD using local calendar parts.
 * Avoids UTC timezone shifts that make "today" become yesterday.
 */
export function formatLocalDateYmd(date: Date | string | null | undefined): string | null {
  if (date == null || date === '') return null;

  if (typeof date === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    const match = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) return match[0];
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return null;
    return formatLocalDateYmd(parsed);
  }

  if (!(date instanceof Date) || isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Keep only digits and cap at PHONE_MAX_LENGTH */
export function sanitizePhoneInput(value: string): string {
  return (value ?? '').replace(/\D/g, '').slice(0, PHONE_MAX_LENGTH);
}

export function phoneInputHandler(
  event: Event,
  control: AbstractControl | null
): void {
  if (!control) return;
  const input = event.target as HTMLInputElement;
  const digitsOnly = sanitizePhoneInput(input.value ?? '');
  if (input.value !== digitsOnly) input.value = digitsOnly;
  if (String(control.value ?? '') !== digitsOnly) {
    control.setValue(digitsOnly, { emitEvent: false });
  }
}

export function isControlInvalid(
  control: AbstractControl | null,
  submitted = false
): boolean {
  if (!control) return false;
  return control.invalid && (control.touched || control.dirty || submitted);
}
