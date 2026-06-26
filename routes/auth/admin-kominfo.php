<?php

use App\Http\Controllers\AdminKominfo\DashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware(['role:admin-kominfo'])->group(function () {
    Route::get('admin-kominfo/dashboard', [DashboardController::class, 'index'])->name('admin-kominfo.dashboard');
});
