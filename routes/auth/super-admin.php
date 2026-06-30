<?php

use App\Http\Controllers\SuperAdmin\DashboardController;
use App\Http\Controllers\SuperAdmin\PeriodController;
use App\Http\Controllers\SuperAdmin\RoleController;
use Illuminate\Support\Facades\Route;

Route::middleware(['role:super-admin'])->prefix('super-admin')->name('super-admin.')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Periods
    Route::get('periods', [PeriodController::class, 'index'])->name('periods.index');
    Route::post('periods', [PeriodController::class, 'store'])->name('periods.store');
    Route::patch('periods/{period}', [PeriodController::class, 'update'])->name('periods.update');
    Route::delete('periods/{period}', [PeriodController::class, 'destroy'])->name('periods.destroy');
    Route::post('periods/{period}/toggle', [PeriodController::class, 'toggleActive'])->name('periods.toggle');

    // Roles
    Route::get('roles', [RoleController::class, 'index'])->name('roles.index');
    Route::patch('roles/{user}', [RoleController::class, 'update'])->name('roles.update');
});
