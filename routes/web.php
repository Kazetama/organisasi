<?php

use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        /** @var User $user */
        $user = request()->user();

        if ($user->hasRole('super-admin')) {
            return redirect()->route('super-admin.dashboard');
        }

        if ($user->hasRole('admin-psdm')) {
            return redirect()->route('admin-psdm.dashboard');
        }

        if ($user->hasRole('admin-kominfo')) {
            return redirect()->route('admin-kominfo.dashboard');
        }

        return redirect()->route('home');
    })->name('dashboard');

    require __DIR__.'/auth/super-admin.php';
    require __DIR__.'/auth/admin-psdm.php';
    require __DIR__.'/auth/admin-kominfo.php';
});

require __DIR__.'/settings.php';
