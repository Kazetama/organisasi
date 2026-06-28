<?php

namespace App\Http\Controllers\AdminKominfo;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminKominfo\StoreMediaRequest;
use App\Models\MediaFile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MediaController extends Controller
{
    public function index(): Response
    {
        $files = MediaFile::with('user')
            ->latest()
            ->paginate(24);

        $files->getCollection()->transform(function (MediaFile $file) {
            return [
                'id' => $file->id,
                'filename' => $file->filename,
                'url' => $file->url(),
                'mime_type' => $file->mime_type,
                'size' => $file->humanSize(),
                'alt' => $file->alt,
                'uploaded_by' => $file->user->name,
                'created_at' => $file->created_at?->diffForHumans(),
            ];
        });

        return Inertia::render('admin-kominfo/media/index', [
            'files' => $files,
        ]);
    }

    public function store(StoreMediaRequest $request): RedirectResponse
    {
        foreach ($request->file('files') as $file) {
            $path = $file->store('media', 'public');

            MediaFile::create([
                'user_id' => $request->user()->id,
                'filename' => $file->getClientOriginalName(),
                'path' => $path,
                'disk' => 'public',
                'mime_type' => $file->getMimeType() ?? 'application/octet-stream',
                'size' => $file->getSize(),
                'alt' => $request->validated('alt'),
            ]);
        }

        return redirect()->route('admin-kominfo.media.index')->with('success', 'File berhasil diunggah.');
    }

    public function destroy(MediaFile $mediaFile): RedirectResponse
    {
        Storage::disk($mediaFile->disk)->delete($mediaFile->path);
        $mediaFile->delete();

        return redirect()->route('admin-kominfo.media.index')->with('success', 'File berhasil dihapus.');
    }
}
