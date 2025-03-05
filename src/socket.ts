import { io } from 'socket.io-client';
import { getUrl } from './urlPicker';


// "undefined" means the URL will be computed from the `window.location` object
const URL = getUrl('chat') ? getUrl('chat') : 'http://localhost:3001';
console.log("Chat url:", URL)
export const socket = io(URL);