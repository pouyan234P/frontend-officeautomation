/**
 * Base URL of the webapi (gateway). Every service builds its URLs from this,
 * and the auth interceptor only attaches the login token to requests that start with it.
 */
export const API_BASE = 'http://localhost:5295/api/';
