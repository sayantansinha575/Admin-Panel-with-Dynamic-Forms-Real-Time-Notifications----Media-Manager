<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Events\NotificationCreated;
use App\Models\Form;
use App\Models\Notification;

class FormController extends Controller
{
    public function store(Request $r)
    {
        $r->validate(['name' => 'required|string']);
        $form = Form::create(['name' => $r->name, 'structure' => $r->structure ?? null]);
        // if fields provided create them
        if ($r->has('fields')) {
            foreach ($r->fields as $idx => $f) {
                $form->fields()->create([
                    'type' => $f['type'],
                    'label' => $f['label'],
                    'options' => $f['options'] ?? null,
                    'order' => $idx,
                    'validation' => $f['validation'] ?? null
                ]);
            }
        }
        // notification
        $notification = Notification::create([
            'title' => "{$form->name} form created",
            'message' => $form->name,
            'type' => 'form',
            'meta' => ['form_id' => $form->id]
        ]);
        event(new NotificationCreated($notification));
        return response()->json($form->load('fields'));
    }
}
