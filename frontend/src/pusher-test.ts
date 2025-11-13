import Pusher from 'pusher-js';

Pusher.logToConsole = true;

const pusher = new Pusher('6920b27e0e34e0054d54', {
    cluster: 'ap2',
});

const channel = pusher.subscribe('notifications');
channel.bind('App\\Events\\NotificationCreated', function (data: any) {
    console.log('🔥 Direct Pusher test:', data);
});
