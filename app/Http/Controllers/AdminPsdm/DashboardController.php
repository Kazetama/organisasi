<?php

namespace App\Http\Controllers\AdminPsdm;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Render the Admin PSDM dashboard page.
     */
    public function index(): Response
    {
        return Inertia::render('admin-psdm/dashboard');
    }
}
