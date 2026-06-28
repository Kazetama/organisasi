import { Head, useForm, router } from '@inertiajs/react';
import { FolderOpen, Pencil, Plus, Trash2, X, Check } from 'lucide-react';
import { useState } from 'react';
import {
    index as categoriesIndex,
    store as categoryStore,
    update as categoryUpdate,
    destroy as categoryDestroy,
} from '@/actions/App/Http/Controllers/AdminKominfo/CategoryController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboard } from '@/routes/admin-kominfo';
import type { Category } from '@/types';

interface Props {
    categories: Category[];
}

export default function CategoriesIndex({ categories }: Props) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const createForm = useForm({ name: '', description: '' });
    const editForm = useForm({ name: '', description: '' });

    function startEdit(cat: Category) {
        setEditingId(cat.id);
        editForm.setData({ name: cat.name, description: cat.description ?? '' });
    }

    function cancelEdit() {
        setEditingId(null);
        editForm.reset();
    }

    function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        createForm.post(categoryStore().url, {
            onSuccess: () => {
                createForm.reset();
                setShowCreateForm(false);
            },
        });
    }

    function handleUpdate(e: React.FormEvent, cat: Category) {
        e.preventDefault();
        editForm.patch(categoryUpdate(cat).url, {
            onSuccess: () => setEditingId(null),
        });
    }

    function handleDelete(cat: Category) {
        if (!confirm(`Hapus kategori "${cat.name}"?`)) {
return;
}

        router.delete(categoryDestroy(cat).url);
    }

    return (
        <>
            <Head title="Kategori" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Kategori</h1>
                        <p className="text-sm text-muted-foreground">{categories.length} kategori</p>
                    </div>
                    <Button
                        size="sm"
                        className="gap-2"
                        onClick={() => setShowCreateForm(!showCreateForm)}
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Kategori
                    </Button>
                </div>

                {/* Create Form */}
                {showCreateForm && (
                    <div className="rounded-xl border border-border bg-card p-5">
                        <h2 className="text-sm font-semibold mb-4">Kategori Baru</h2>
                        <form onSubmit={handleCreate} className="flex flex-col gap-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="new-cat-name">Nama *</Label>
                                    <Input
                                        id="new-cat-name"
                                        placeholder="Nama kategori..."
                                        value={createForm.data.name}
                                        onChange={(e) => createForm.setData('name', e.target.value)}
                                        autoFocus
                                    />
                                    {createForm.errors.name && <p className="text-xs text-destructive">{createForm.errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new-cat-desc">Deskripsi</Label>
                                    <Input
                                        id="new-cat-desc"
                                        placeholder="Deskripsi singkat..."
                                        value={createForm.data.description}
                                        onChange={(e) => createForm.setData('description', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button type="submit" size="sm" disabled={createForm.processing}>Simpan</Button>
                                <Button type="button" size="sm" variant="ghost" onClick={() => setShowCreateForm(false)}>Batal</Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* List */}
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                    {categories.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <FolderOpen className="h-10 w-10 text-muted-foreground/30 mb-4" />
                            <p className="text-sm font-medium">Belum ada kategori</p>
                            <p className="text-xs text-muted-foreground mt-1">Buat kategori untuk mengelompokkan post.</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/30">
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nama</th>
                                    <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Slug</th>
                                    <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Deskripsi</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Post</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {categories.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-muted/20 transition-colors">
                                        {editingId === cat.id ? (
                                            <td colSpan={5} className="px-4 py-3">
                                                <form onSubmit={(e) => handleUpdate(e, cat)} className="flex items-center gap-3 flex-wrap">
                                                    <Input
                                                        value={editForm.data.name}
                                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                                        className="h-8 w-40"
                                                        autoFocus
                                                    />
                                                    <Input
                                                        value={editForm.data.description}
                                                        onChange={(e) => editForm.setData('description', e.target.value)}
                                                        placeholder="Deskripsi..."
                                                        className="h-8 flex-1"
                                                    />
                                                    <div className="flex gap-1">
                                                        <Button type="submit" size="sm" className="h-8 w-8 p-0" disabled={editForm.processing}>
                                                            <Check className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button type="button" size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={cancelEdit}>
                                                            <X className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </form>
                                            </td>
                                        ) : (
                                            <>
                                                <td className="px-4 py-4 font-medium">{cat.name}</td>
                                                <td className="hidden sm:table-cell px-4 py-4 text-muted-foreground font-mono text-xs">{cat.slug}</td>
                                                <td className="hidden md:table-cell px-4 py-4 text-muted-foreground">{cat.description ?? '—'}</td>
                                                <td className="px-4 py-4 text-center">
                                                    <span className="inline-flex items-center justify-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                                                        {cat.posts_count}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                            onClick={() => startEdit(cat)}
                                                        >
                                                            <Pencil className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                            onClick={() => handleDelete(cat)}
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
}

CategoriesIndex.layout = {
    breadcrumbs: [
        { title: 'Kominfo Dashboard', href: dashboard().url },
        { title: 'Kategori', href: categoriesIndex().url },
    ],
};
