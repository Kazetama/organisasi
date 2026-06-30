<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller
{
    /**
     * Display a list of users for role assignment.
     */
    public function index(Request $request): Response
    {
        $query = User::query();

        // Search filter
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Role filter
        if ($role = $request->input('role')) {
            $query->where('role', $role);
        }

        $users = $query->oldest('name')->paginate(15)->withQueryString();

        $roles = [
            ['value' => 'super-admin', 'label' => 'Super Admin'],
            ['value' => 'admin-psdm', 'label' => 'Admin PSDM'],
            ['value' => 'admin-kominfo', 'label' => 'Admin Kominfo'],
            ['value' => 'member', 'label' => 'Member'],
        ];

        return Inertia::render('super-admin/roles/index', [
            'users' => $users,
            'roles' => $roles,
            'filters' => $request->only(['search', 'role']),
        ]);
    }

    /**
     * Update the user's role in storage.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $request->validate([
            'role' => 'required|string|in:super-admin,admin-psdm,admin-kominfo,member',
        ]);

        // Safety: Prevent self-demotion from super-admin
        if ($user->id === $request->user()->id && $request->role !== 'super-admin') {
            return redirect()->back()->with('error', 'Anda tidak bisa menurunkan role akun Anda sendiri!');
        }

        $user->update([
            'role' => $request->role,
        ]);

        return redirect()->route('super-admin.roles.index')->with('success', 'Role user '.$user->name.' berhasil diperbarui!');
    }
}
