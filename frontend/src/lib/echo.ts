import Pusher from 'pusher-js';

// Enable logging (for development only)
Pusher.logToConsole = true;

// Create a global Pusher instance 
 export const echo = new Pusher('6920b27e0e34e0054d54', {
    cluster: 'ap2',
    forceTLS: true,
});

