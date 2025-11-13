<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    public function index(Request $r)
    {
        return response()->json(Notification::orderBy('created_at', 'desc')->paginate(25));
    }

    public function markRead($id)
    {
        $n = Notification::findOrFail($id);
        $n->update(['read_at' => now()]);
        return response()->json($n);
    }
}
