<?php

namespace App\Http\Controllers\AdminKominfo;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Render the Admin Kominfo dashboard page.
     */
    public function index(): Response
    {
        return Inertia::render('admin-kominfo/dashboard');
    }
}
