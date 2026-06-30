import { Head, useForm, router } from '@inertiajs/react';
import { Calendar, Plus, Pencil, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { useState } from 'react';
import {
    index as periodsIndex,
    store as periodStore,
    update as periodUpdate,
    destroy as periodDestroy,
    toggleActive as periodToggle,
} from '@/actions/App/Http/Controllers/SuperAdmin/PeriodController';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboard } from '@/routes/super-admin';
import type { Period } from '@/types';

interface Props {
    periods: Period[];
}

export default function PeriodsIndex({ periods }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [editingPeriod, setEditingPeriod] = useState<Period | null>(null);

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        name: '',
        start_date: '',
        end_date: '',
    });

    function openCreate() {
        setEditingPeriod(null);
        reset();
        setShowModal(true);
    }

    function openEdit(period: Period) {
        setEditingPeriod(period);
        setData({
            name: period.name,
            start_date: period.start_date ? period.start_date.slice(0, 10) : '',
            end_date: period.end_date ? period.end_date.slice(0, 10) : '',
        });
        setShowModal(true);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (editingPeriod) {
            patch(periodUpdate(editingPeriod).url, {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        } else {
            post(periodStore().url, {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        }
    }

    function handleToggle(period: Period) {
        if (period.is_active) {
return;
}

        if (!confirm(`Aktifkan periode "${period.name}"? Ini akan menonaktifkan periode lainnya.`)) {
            return;
        }

        router.post(periodToggle(period).url);
    }

    function handleDelete(period: Period) {
        if (period.is_active) {
            alert('Tidak bisa menghapus periode yang sedang aktif!');

            return;
        }

        if (!confirm(`Hapus periode "${period.name}"? Tindakan ini tidak bisa dibatalkan.`)) {
            return;
        }

        router.delete(periodDestroy(period).url);
    }

    return (
        <>
            <Head title="Kelola Periode" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20">
                            <Calendar className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Kelola Periode</h1>
                            <p className="text-sm text-muted-foreground">Atur periode tahun kepengurusan aktif organisasi</p>
                        </div>
                    </div>
                    <Button size="sm" className="gap-2" onClick={openCreate}>
                        <Plus className="h-4 w-4" />
                        Tambah Periode
                    </Button>
                </div>

                {/* Grid/Table List */}
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                    {periods.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <Calendar className="h-10 w-10 text-muted-foreground/30 mb-4" />
                            <p className="text-sm font-medium">Belum ada periode kepengurusan</p>
                            <p className="text-xs text-muted-foreground mt-1">Buat periode pertama Anda untuk memulai penugasan bagan organisasi.</p>
                            <Button size="sm" variant="outline" className="mt-4" onClick={openCreate}>
                                Buat Periode Pertama
                            </Button>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/30">
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nama Periode</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Tanggal Mulai</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Tanggal Selesai</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Status Aktif</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {periods.map((period) => (
                                    <tr key={period.id} className="hover:bg-muted/20 transition-colors">
                                        <td className="px-4 py-4 font-semibold">{period.name}</td>
                                        <td className="px-4 py-4 text-muted-foreground">{period.start_date ? new Date(period.start_date).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : '—'}</td>
                                        <td className="px-4 py-4 text-muted-foreground">{period.end_date ? new Date(period.end_date).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : '—'}</td>
                                        <td className="px-4 py-4 text-center">
                                            <button
                                                onClick={() => handleToggle(period)}
                                                disabled={period.is_active}
                                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border transition-all ${
                                                    period.is_active
                                                        ? 'bg-green-500/10 text-green-500 border-green-500/20 cursor-default'
                                                        : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20 hover:text-foreground hover:border-foreground/30 cursor-pointer'
                                                }`}
                                            >
                                                {period.is_active ? (
                                                    <><CheckCircle2 className="h-3.5 w-3.5" /> Aktif</>
                                                ) : (
                                                    <><Circle className="h-3.5 w-3.5" /> Set Aktif</>
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => openEdit(period)}
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => handleDelete(period)}
                                                    disabled={period.is_active}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Create/Edit Modal */}
                <Dialog open={showModal} onOpenChange={setShowModal}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingPeriod ? 'Edit Periode' : 'Tambah Periode Baru'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                            <div className="space-y-2">
                                <Label htmlFor="period-name">Nama Periode *</Label>
                                <Input
                                    id="period-name"
                                    placeholder="Contoh: Periode 2025/2026 atau 2025"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    autoFocus
                                />
                                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="period-start">Tanggal Mulai</Label>
                                    <Input
                                        id="period-start"
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                    />
                                    {errors.start_date && <p className="text-xs text-destructive">{errors.start_date}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="period-end">Tanggal Selesai</Label>
                                    <Input
                                        id="period-end"
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                    />
                                    {errors.end_date && <p className="text-xs text-destructive">{errors.end_date}</p>}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>Batal</Button>
                                <Button type="submit" disabled={processing}>Simpan</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

PeriodsIndex.layout = {
    breadcrumbs: [
        { title: 'Super Admin Dashboard', href: dashboard().url },
        { title: 'Kelola Periode', href: periodsIndex().url },
    ],
};
