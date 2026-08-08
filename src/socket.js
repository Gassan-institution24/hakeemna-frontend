import { io } from 'socket.io-client';

import { paths } from 'src/routes/paths';

import { HOST_API } from './config-global';

const URL = HOST_API;

const readToken = () => {
  try {
    return localStorage.getItem('accessToken') || null;
  } catch (error) {
    return null;
  }
};

const socket = io(URL, {
  timeout: 5000,
  // Sent to the server's io.use(socketDemoGuard) handshake check. The server treats a missing
  // or unverifiable token as "not a demo account" and lets the connection through, so this is
  // purely additive — nothing breaks if the token is absent.
  auth: { token: readToken() },
});

// socket.auth is read at each (re)connection attempt, so refreshing it here means a socket that
// reconnects after a login picks up the new token instead of replaying a stale one.
socket.io.on('reconnect_attempt', () => {
  socket.auth = { token: readToken() };
});

socket.on('connect_error', (error) => {
  console.info('Failed to connect to the backend server:', error);

  // if (window.location.pathname !== '/maintenance') {
  //   window.location.pathname = '/maintenance';
  // }
});
socket.on('connect', () => {
  console.info('Successfully connected to the backend server');
  socket.auth = { token: readToken() };
  // if (window.location.pathname === '/maintenance') {
  //   window.history.back();
  // }
});

/**
 * Emitted by the server when a demo account's trial has ended — either at handshake time, when
 * the socket tries to identify itself via `sendUser`, or when the expiry sweep kicks live
 * sessions. Tear the session down so an idle tab cannot keep sitting on a dashboard whose
 * every request now 403s.
 *
 * Mirrors the 403 branch of the axios interceptor in src/utils/axios.js.
 */
socket.on('demo:expired', () => {
  try {
    localStorage.removeItem('accessToken');
    sessionStorage.setItem('demoExpired', '1');
  } catch (error) {
    /* storage unavailable — the redirect below still happens */
  }

  if (window.location.pathname !== paths.auth.login) {
    window.location.href = paths.auth.login;
  }
});

export default socket;
