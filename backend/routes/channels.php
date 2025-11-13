<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('notifications', function () {
    return true; // anyone can listen (public)
});
