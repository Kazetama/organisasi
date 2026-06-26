<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Render the Super Admin dashboard page.
     */
    public function index(): Response
    {
        return Inertia::render('super-admin/dashboard');
    }
}
