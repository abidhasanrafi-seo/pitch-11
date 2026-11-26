import { io, Socket } from 'socket.io-client';
import { supabase } from '../supabase/client';

const BACKEND_URL = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:4000';

let socket: Socket | null = null;

export async function getToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || null;
}

export async function connectSocket(): Promise<Socket | null> {
  const token = await getToken();
  if (!token) return null;
  if (socket && socket.connected) return socket;
  socket = io(BACKEND_URL, { auth: { token }, transports: ['websocket', 'polling'] });
  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket() {
  if (socket) { socket.disconnect(); socket = null; }
}

export async function api(path: string, opts: RequestInit = {}) {
  const token = await getToken();
  const res = await fetch(BACKEND_URL + path, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
      ...(opts.headers || {}),
    },
  });
  return res.json();
}
