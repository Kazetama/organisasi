<?php

namespace App\Http\Controllers\AdminKominfo;

use App\Enums\PostStatus;
use App\Enums\PostType;
use App\Http\Controllers\Controller;
use App\Http\Requests\AdminKominfo\StorePostRequest;
use App\Http\Requests\AdminKominfo\UpdatePostRequest;
use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function index(Request $request): Response
    {
        $posts = Post::query()
            ->with(['author', 'categories', 'tags'])
            ->when($request->get('status'), fn ($q, $status) => $q->where('status', $status))
            ->when($request->get('type'), fn ($q, $type) => $q->where('type', $type))
            ->when($request->get('search'), fn ($q, $search) => $q->where('title', 'like', "%{$search}%"))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin-kominfo/posts/index', [
            'posts' => $posts,
            'filters' => $request->only(['status', 'type', 'search']),
            'statuses' => collect(PostStatus::cases())->map(fn ($s) => ['value' => $s->value, 'label' => $s->label()]),
            'types' => collect(PostType::cases())->map(fn ($t) => ['value' => $t->value, 'label' => $t->label()]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin-kominfo/posts/create', [
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'tags' => Tag::orderBy('name')->get(['id', 'name']),
            'statuses' => collect(PostStatus::cases())->map(fn ($s) => ['value' => $s->value, 'label' => $s->label()]),
            'types' => collect(PostType::cases())->map(fn ($t) => ['value' => $t->value, 'label' => $t->label()]),
        ]);
    }

    public function store(StorePostRequest $request): RedirectResponse
    {
        $data = $request->safe()->except(['cover_image', 'category_ids', 'tag_ids']);

        $data['user_id'] = $request->user()->id;
        $data['slug'] = Post::generateSlug($data['title']);
        $data['reading_time'] = Post::estimateReadingTime($data['body']);

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('posts/covers', 'public');
        }

        /** @var Post $post */
        $post = Post::create($data);
        $post->categories()->sync($request->validated('category_ids', []));
        $post->tags()->sync($request->validated('tag_ids', []));

        return redirect()->route('admin-kominfo.posts.index')->with('success', 'Post berhasil dibuat.');
    }

    public function edit(Post $post): Response
    {
        $post->load(['categories', 'tags']);

        return Inertia::render('admin-kominfo/posts/edit', [
            'post' => $post,
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'tags' => Tag::orderBy('name')->get(['id', 'name']),
            'statuses' => collect(PostStatus::cases())->map(fn ($s) => ['value' => $s->value, 'label' => $s->label()]),
            'types' => collect(PostType::cases())->map(fn ($t) => ['value' => $t->value, 'label' => $t->label()]),
        ]);
    }

    public function update(UpdatePostRequest $request, Post $post): RedirectResponse
    {
        $data = $request->safe()->except(['cover_image', 'category_ids', 'tag_ids']);

        $data['reading_time'] = Post::estimateReadingTime($data['body']);

        if ($request->hasFile('cover_image')) {
            if ($post->cover_image) {
                Storage::disk('public')->delete($post->cover_image);
            }
            $data['cover_image'] = $request->file('cover_image')->store('posts/covers', 'public');
        }

        $post->update($data);
        $post->categories()->sync($request->validated('category_ids', []));
        $post->tags()->sync($request->validated('tag_ids', []));

        return redirect()->route('admin-kominfo.posts.index')->with('success', 'Post berhasil diperbarui.');
    }

    public function destroy(Post $post): RedirectResponse
    {
        if ($post->cover_image) {
            Storage::disk('public')->delete($post->cover_image);
        }

        $post->delete();

        return redirect()->route('admin-kominfo.posts.index')->with('success', 'Post berhasil dihapus.');
    }
}
