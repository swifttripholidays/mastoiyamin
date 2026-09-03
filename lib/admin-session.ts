import { cookies } from 'next/headers';

const COOKIE_NAME = 'ym_admin_session';
const SESSION_SECONDS = 60 * 60 * 8;

function runtimeValue(key: string) {
  const value = process.env[key];
  return typeof value === 'string' ? value : '';
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function signature(payload: string) {
  const secret = runtimeValue('ADMIN_SESSION_SECRET');
  if (!secret) return '';
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return bytesToBase64Url(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(payload))));
}

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index += 1) result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return result === 0;
}

export function adminCodeIsConfigured() {
  return Boolean(runtimeValue('ADMIN_ACCESS_CODE') && runtimeValue('ADMIN_SESSION_SECRET'));
}

export function verifyAdminCode(code: string) {
  const configured = runtimeValue('ADMIN_ACCESS_CODE');
  return Boolean(configured) && constantTimeEqual(code, configured);
}

export async function createAdminSession() {
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = `owner.${expires}`;
  return `${payload}.${await signature(payload)}`;
}

export async function setAdminSessionCookie() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, await createAdminSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_SECONDS,
  });
}

export async function hasAdminSession() {
  if (!adminCodeIsConfigured()) return false;
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  if (!value) return false;
  const splitAt = value.lastIndexOf('.');
  if (splitAt < 1) return false;
  const payload = value.slice(0, splitAt);
  const supplied = value.slice(splitAt + 1);
  const payloadSplit = payload.lastIndexOf('.');
  const owner = payload.slice(0, payloadSplit);
  const expires = Number(payload.slice(payloadSplit + 1));
  if (owner !== 'owner' || !Number.isFinite(expires) || expires < Date.now() / 1000) return false;
  return constantTimeEqual(supplied, await signature(payload));
}

export async function clearAdminSession() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 0 });
}
