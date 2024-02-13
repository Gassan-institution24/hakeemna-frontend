import { io } from 'socket.io-client';

import { HOST_API } from './config-global';

const URL = HOST_API;

export const socket = io(URL);
