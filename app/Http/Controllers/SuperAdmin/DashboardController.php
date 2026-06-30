<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Models\Period;
use App\Models\Post;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Render the Super Admin dashboard page with executive statistics.
     */
    public function index(): Response
    {
        // 1. Membership Stats
        $membersCount = Member::where('status', 'aktif')->count();
        $alumniCount = Member::where('status', 'alumni')->count();
        $demisionerCount = Member::where('status', 'demisioner')->count();

        // 2. Angkatan Distribution
        $angkatanStats = Member::selectRaw('angkatan, count(*) as total')
            ->whereNotNull('angkatan')
            ->groupBy('angkatan')
            ->orderBy('angkatan', 'asc')
            ->get();

        // 3. Blog Stats
        $totalPosts = Post::count();
        $publishedPosts = Post::where('status', 'published')->count();
        $draftPosts = Post::where('status', 'draft')->count();

        // 4. Period info
        $activePeriod = Period::where('is_active', true)->first();

        return Inertia::render('super-admin/dashboard', [
            'stats' => [
                'members_aktif' => $membersCount,
                'members_alumni' => $alumniCount,
                'members_demisioner' => $demisionerCount,
                'total_posts' => $totalPosts,
                'published_posts' => $publishedPosts,
                'draft_posts' => $draftPosts,
            ],
            'angkatan_stats' => $angkatanStats,
            'active_period' => $activePeriod ? $activePeriod->name : 'Tidak ada',
        ]);
    }
}
