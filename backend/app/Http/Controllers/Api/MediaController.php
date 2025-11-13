<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Notification;
use App\Models\Media;
use Illuminate\Support\Facades\Storage;
use App\Events\NotificationCreated;

class MediaController extends Controller
{

    public function index()
    {
        // Example: Fetch all media records
        $media = Media::all();

        return response()->json([
            'status' => true,
            'data' => $media
        ]);
    }

    public function store(Request $r)
    {
        $r->validate(['file' => 'required|file|max:10240|mimes:jpg,jpeg,png,gif,pdf,doc,docx']);
        $file = $r->file('file');
        $path = $file->store('uploads', 'public');
        $media = Media::create([
            'original_name' => $file->getClientOriginalName(),
            'path' => $path,
            'mime' => $file->getClientMimeType(),
            'size' => $file->getSize(),
            'url' => asset('storage/' . $path)
        ]);
        $notification = Notification::create([
            'title' => "{$media->original_name} file uploaded",
            'message' => $media->original_name,
            'type' => 'file',
            'meta' => ['media_id' => $media->id, 'url' => $media->url]
        ]);
        event(new NotificationCreated($notification));
        return response()->json($media);
    }

    public function destroy($id)
    {
        $media = Media::find($id);

        if (!$media) {
            return response()->json(['message' => 'Media not found'], 404);
        }

        // Optional: delete file from storage if exists
        if ($media->path && Storage::exists($media->path)) {
            Storage::delete($media->path);
        }

        // Delete DB record
        $media->delete();

        return response()->json(['message' => 'Media deleted successfully']);
    }


}
