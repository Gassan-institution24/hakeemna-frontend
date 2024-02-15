import { io } from 'socket.io-client';

import { HOST_API } from './config-global';

const URL = HOST_API;

// Establish a socket connection to the backend server
const socket = io(URL, {
  timeout: 5000, // Set a timeout for the connection attempt
});

// Listen for the 'connect_error' event, which indicates a connection failure
socket.on('connect_error', (error) => {
  //   console.error('Failed to connect to the backend server:', error);
  // Redirect to the maintenance page or handle the error as needed

  if (window.location.pathname !== '/maintenance') {
    // Redirect to the maintenance page
    window.location.href = '/maintenance';
  }
});
socket.on('connect', () => {
  console.log('Successfully connected to the backend server');
  // Check if the current URL is not already '/'
  if (window.location.pathname === '/maintenance') {
    // Redirect to the homepage
    window.location.href = '/';
  }
});

// Export the socket instance for use in other modules
export default socket;
