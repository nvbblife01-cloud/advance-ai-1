import { cookies } from 'next/headers';

const COOKIE_NAME = 'crm_lite_session';

export function isAuthenticated() {
  return cookies().get(COOKIE_NAME)?.value === 'ok';
}

export function setAuthCookie() {
  cookies().set(COOKIE_NAME, 'ok', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });
}

export function clearAuthCookie() {
  cookies().delete(COOKIE_NAME);
}
