<?php

use App\Http\Controllers\AdminKominfo\CategoryController;
use App\Http\Controllers\AdminKominfo\DashboardController;
use App\Http\Controllers\AdminKominfo\MediaController;
use App\Http\Controllers\AdminKominfo\PostController;
use App\Http\Controllers\AdminKominfo\TagController;
use Illuminate\Support\Facades\Route;

Route::middleware(['role:admin-kominfo'])->prefix('admin-kominfo')->name('admin-kominfo.')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Posts
    Route::get('posts', [PostController::class, 'index'])->name('posts.index');
    Route::get('posts/create', [PostController::class, 'create'])->name('posts.create');
    Route::post('posts', [PostController::class, 'store'])->name('posts.store');
    Route::get('posts/{post}/edit', [PostController::class, 'edit'])->name('posts.edit');
    Route::patch('posts/{post}', [PostController::class, 'update'])->name('posts.update');
    Route::delete('posts/{post}', [PostController::class, 'destroy'])->name('posts.destroy');

    // Categories
    Route::get('categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::post('categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::patch('categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    // Tags
    Route::get('tags', [TagController::class, 'index'])->name('tags.index');
    Route::post('tags', [TagController::class, 'store'])->name('tags.store');
    Route::delete('tags/{tag}', [TagController::class, 'destroy'])->name('tags.destroy');

    // Media
    Route::get('media', [MediaController::class, 'index'])->name('media.index');
    Route::post('media', [MediaController::class, 'store'])->name('media.store');
    Route::delete('media/{mediaFile}', [MediaController::class, 'destroy'])->name('media.destroy');
    Route::get('api/media', function () {
        return response()->json(
            \App\Models\MediaFile::latest()->get()->map(fn ($f) => [
                'id' => $f->id,
                'url' => $f->url(),
                'filename' => $f->filename,
            ])
        );
    })->name('api.media');
});
