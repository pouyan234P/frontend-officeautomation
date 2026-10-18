import { HttpErrorResponse } from '@angular/common/http';

/** Turns an API error (usually a list of messages on 400) into one readable line. */
export function describeApiError(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 0) return 'Cannot reach the server. Check that the API is running.';
    if (err.status === 403) return 'You do not have permission to do this.';
    const body = err.error;
    if (Array.isArray(body) && body.length) return body.join(' ');
    if (typeof body === 'string' && body) return body;
    if (body?.errors) return Object.values(body.errors).flat().join(' ');
    if (body?.message) return body.message;
    return err.statusText || 'Unknown error';
  }
  return (err as any)?.message || 'Unknown error';
}
