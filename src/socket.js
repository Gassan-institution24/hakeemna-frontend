import { io } from 'socket.io-client';

import { HOST_API } from './config-global';

const URL = HOST_API;

const socket = io(URL, {
  timeout: 5000,
});

socket.on('connect_error', (error) => {
  console.info('Failed to connect to the backend server:', error);

  // if (window.location.pathname !== '/maintenance') {
  //   window.location.pathname = '/maintenance';
  // }
});
socket.on('connect', () => {
  console.info('Successfully connected to the backend server');
  // if (window.location.pathname === '/maintenance') {
  //   window.history.back();
  // }
});

export default socket;
