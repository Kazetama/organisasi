<?php

namespace App\Http\Controllers\AdminKominfo;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminKominfo\StoreTagRequest;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TagController extends Controller
{
    public function index(): Response
    {
        $tags = Tag::withCount('posts')->orderBy('name')->get();

        return Inertia::render('admin-kominfo/tags/index', [
            'tags' => $tags,
        ]);
    }

    public function store(StoreTagRequest $request): RedirectResponse
    {
        Tag::create([
            'name' => $request->validated('name'),
            'slug' => Str::slug($request->validated('name')),
        ]);

        return redirect()->route('admin-kominfo.tags.index')->with('success', 'Tag berhasil ditambahkan.');
    }

    public function destroy(Tag $tag): RedirectResponse
    {
        $tag->delete();

        return redirect()->route('admin-kominfo.tags.index')->with('success', 'Tag berhasil dihapus.');
    }
}
