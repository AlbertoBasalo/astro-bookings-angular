import { HttpErrorResponse } from '@angular/common/http';

import { ErrorResponse, ValidationError } from '../data-access/rockets.models';

export type RocketsUiError =
  | { kind: 'validation'; message: string; fieldErrors: Record<string, string> }
  | { kind: 'not-found'; message: string }
  | { kind: 'unknown'; message: string };

export function presentRocketsError(error: unknown, fallbackMessage: string): RocketsUiError {
  if (!(error instanceof HttpErrorResponse)) {
    return { kind: 'unknown', message: fallbackMessage };
  }

  if (error.status === 400) {
    return {
      kind: 'validation',
      message: 'Please correct the highlighted fields and try again.',
      fieldErrors: toFieldErrorMap(error.error),
    };
  }

  if (error.status === 404) {
    return {
      kind: 'not-found',
      message: 'This rocket no longer exists. Return to the rockets list and choose another one.',
    };
  }

  return {
    kind: 'unknown',
    message: fallbackMessage,
  };
}

function toFieldErrorMap(payload: unknown): Record<string, string> {
  if (!isErrorResponse(payload)) {
    return {};
  }

  return payload.errors.reduce<Record<string, string>>((acc, item) => {
    if (item.field && item.message) {
      acc[item.field] = item.message;
    }

    return acc;
  }, {});
}

function isErrorResponse(payload: unknown): payload is ErrorResponse {
  if (!payload || typeof payload !== 'object' || !('errors' in payload)) {
    return false;
  }

  const errors = (payload as { errors: unknown }).errors;
  return Array.isArray(errors) && errors.every(isValidationError);
}

function isValidationError(value: unknown): value is ValidationError {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as { field?: unknown; message?: unknown };
  return typeof candidate.field === 'string' && typeof candidate.message === 'string';
}
