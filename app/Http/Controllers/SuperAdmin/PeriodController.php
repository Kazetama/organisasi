<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Period;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PeriodController extends Controller
{
    /**
     * Display a listing of the periods.
     */
    public function index(): Response
    {
        $periods = Period::orderBy('name', 'desc')->get();

        return Inertia::render('super-admin/periods/index', [
            'periods' => $periods,
        ]);
    }

    /**
     * Store a newly created period in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        Period::create([
            'name' => $request->name,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'is_active' => false,
        ]);

        return redirect()->route('super-admin.periods.index')->with('success', 'Periode kepengurusan berhasil ditambahkan!');
    }

    /**
     * Update the specified period in storage.
     */
    public function update(Request $request, Period $period): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $period->update([
            'name' => $request->name,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
        ]);

        return redirect()->route('super-admin.periods.index')->with('success', 'Periode kepengurusan berhasil diperbarui!');
    }

    /**
     * Remove the specified period from storage.
     */
    public function destroy(Period $period): RedirectResponse
    {
        if ($period->is_active) {
            return redirect()->route('super-admin.periods.index')->with('error', 'Tidak bisa menghapus periode yang sedang aktif!');
        }

        $period->delete();

        return redirect()->route('super-admin.periods.index')->with('success', 'Periode kepengurusan berhasil dihapus!');
    }

    /**
     * Set the specified period as active.
     */
    public function toggleActive(Period $period): RedirectResponse
    {
        Period::activatePeriod($period);

        return redirect()->route('super-admin.periods.index')->with('success', 'Periode "'.$period->name.'" sekarang aktif!');
    }
}
