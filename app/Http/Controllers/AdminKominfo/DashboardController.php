<?php

namespace App\Http\Controllers\AdminKominfo;

use App\Enums\PostStatus;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\MediaFile;
use App\Models\Post;
use App\Models\Tag;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Render the Admin Kominfo dashboard page.
     */
    public function index(): Response
    {
        return Inertia::render('admin-kominfo/dashboard', [
            'stats' => [
                'total_posts' => Post::count(),
                'published' => Post::where('status', PostStatus::Published)->count(),
                'drafts' => Post::where('status', PostStatus::Draft)->count(),
                'scheduled' => Post::where('status', PostStatus::Scheduled)->count(),
                'categories' => Category::count(),
                'tags' => Tag::count(),
                'media_files' => MediaFile::count(),
            ],
            'recent_posts' => Post::with('author')
                ->latest()
                ->take(5)
                ->get(['id', 'title', 'type', 'status', 'published_at', 'user_id', 'created_at']),
        ]);
    }
}
