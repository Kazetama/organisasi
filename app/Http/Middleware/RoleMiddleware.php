<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        /** @var User|null $user */
        $user = $request->user();

        if (! $user || ! $user->hasRole($role)) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Akses ditolak: Anda tidak memiliki wewenang untuk mengakses halaman tersebut.',
            ]);

            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}
