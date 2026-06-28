import { Head, useForm, router } from '@inertiajs/react';
import { Tag, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import {
    index as tagsIndex,
    store as tagStore,
    destroy as tagDestroy,
} from '@/actions/App/Http/Controllers/AdminKominfo/TagController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboard } from '@/routes/admin-kominfo';
import type { TagItem } from '@/types';

interface Props {
    tags: TagItem[];
}

export default function TagsIndex({ tags }: Props) {
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({ name: '' });

    function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        post(tagStore().url, {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    }

    function handleDelete(tag: TagItem) {
        if (!confirm(`Hapus tag "${tag.name}"?`)) {
return;
}

        router.delete(tagDestroy(tag).url);
    }

    return (
        <>
            <Head title="Tags" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Tags</h1>
                        <p className="text-sm text-muted-foreground">{tags.length} tag</p>
                    </div>
                    <Button size="sm" className="gap-2" onClick={() => setShowForm(!showForm)}>
                        <Plus className="h-4 w-4" />
                        Tambah Tag
                    </Button>
                </div>

                {/* Create Form */}
                {showForm && (
                    <div className="rounded-xl border border-border bg-card p-5">
                        <form onSubmit={handleCreate} className="flex items-end gap-3">
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="new-tag-name">Nama Tag *</Label>
                                <Input
                                    id="new-tag-name"
                                    placeholder="Nama tag..."
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    autoFocus
                                />
                                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                            </div>
                            <Button type="submit" size="sm" disabled={processing}>Tambah</Button>
                            <Button type="button" size="sm" variant="ghost" onClick={() => setShowForm(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                )}

                {/* Tags Cloud */}
                {tags.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
                        <Tag className="h-10 w-10 text-muted-foreground/30 mb-4" />
                        <p className="text-sm font-medium">Belum ada tag</p>
                        <p className="text-xs text-muted-foreground mt-1">Tag membantu pengunjung menemukan konten terkait.</p>
                    </div>
                ) : (
                    <div className="rounded-xl border border-border bg-card p-5">
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <div
                                    key={tag.id}
                                    className="group flex items-center gap-2 rounded-full border border-border bg-muted/30 px-3 py-1.5 hover:border-border/80 transition-colors"
                                >
                                    <Tag className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-sm font-medium">{tag.name}</span>
                                    <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                                        {tag.posts_count}
                                    </span>
                                    <button
                                        onClick={() => handleDelete(tag)}
                                        className="opacity-0 group-hover:opacity-100 ml-1 text-muted-foreground hover:text-destructive transition-all"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Table */}
                {tags.length > 0 && (
                    <div className="rounded-xl border border-border bg-card overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/30">
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nama</th>
                                    <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Slug</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Post</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {tags.map((tag) => (
                                    <tr key={tag.id} className="hover:bg-muted/20 transition-colors">
                                        <td className="px-4 py-3 font-medium">{tag.name}</td>
                                        <td className="hidden sm:table-cell px-4 py-3 text-muted-foreground font-mono text-xs">{tag.slug}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="inline-flex items-center justify-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                                                {tag.posts_count}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                onClick={() => handleDelete(tag)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}

TagsIndex.layout = {
    breadcrumbs: [
        { title: 'Kominfo Dashboard', href: dashboard().url },
        { title: 'Tags', href: tagsIndex().url },
    ],
};
