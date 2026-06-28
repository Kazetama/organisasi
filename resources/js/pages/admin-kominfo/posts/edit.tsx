import { Head, useForm } from '@inertiajs/react';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Send, Trash2 } from 'lucide-react';
import {
    index as postsIndex,
    update as postUpdate,
    destroy as postDestroy,
} from '@/actions/App/Http/Controllers/AdminKominfo/PostController';
import { BlockEditor } from '@/components/block-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboard } from '@/routes/admin-kominfo';
import type { Post, SelectOption, PostType, PostStatus } from '@/types';

interface Props {
    post: Post;
    categories: { id: number; name: string }[];
    tags: { id: number; name: string }[];
    statuses: SelectOption[];
    types: SelectOption[];
}

export default function PostEdit({ post, categories, tags, statuses, types }: Props) {
    const { data, setData, post: submit, processing, errors } = useForm({
        title: post.title,
        type: post.type,
        excerpt: post.excerpt ?? '',
        body: post.body,
        status: post.status,
        published_at: post.published_at ? post.published_at.slice(0, 16) : '',
        cover_image: null as File | null,
        category_ids: post.categories.map((c) => c.id),
        tag_ids: post.tags.map((t) => t.id),
        meta_title: post.meta_title ?? '',
        meta_description: post.meta_description ?? '',
        _method: 'PATCH',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        submit(postUpdate(post).url, { forceFormData: true });
    }

    function handleDelete() {
        if (!confirm(`Hapus post "${post.title}"? Tindakan ini tidak bisa dibatalkan.`)) {
            return;
        }

        router.delete(postDestroy(post).url);
    }

    function toggleId(list: number[], id: number): number[] {
        return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
    }

    return (
        <>
            <Head title={`Edit: ${post.title}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <Button asChild variant="ghost" size="sm" className="gap-2 -ml-2">
                        <Link href={postsIndex().url}>
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </Link>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-destructive hover:text-destructive"
                        onClick={handleDelete}
                    >
                        <Trash2 className="h-4 w-4" />
                        Hapus Post
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">

                    {/* Main Content */}
                    <div className="lg:col-span-2 flex flex-col gap-5">

                        <div className="space-y-2">
                            <Label htmlFor="edit-title">Judul *</Label>
                            <Input
                                id="edit-title"
                                value={data.title}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setData((prev) => ({ ...prev, title: val, meta_title: val }));
                                }}
                                className="text-lg font-medium h-12"
                            />
                            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-excerpt">Ringkasan</Label>
                            <textarea
                                id="edit-excerpt"
                                value={data.excerpt}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setData((prev) => ({ ...prev, excerpt: val, meta_description: val.slice(0, 160) }));
                                }}
                                rows={2}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-body">Konten *</Label>
                            <BlockEditor
                                value={data.body}
                                onChange={(val) => setData('body', val)}
                            />
                            {errors.body && <p className="text-xs text-destructive">{errors.body}</p>}
                        </div>

                        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                            <h3 className="text-sm font-semibold">SEO</h3>
                            <div className="space-y-2">
                                <Label htmlFor="edit-meta-title">Meta Title</Label>
                                <Input
                                    id="edit-meta-title"
                                    value={data.meta_title}
                                    onChange={(e) => setData('meta_title', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-meta-desc">Meta Description</Label>
                                <textarea
                                    id="edit-meta-desc"
                                    value={data.meta_description}
                                    onChange={(e) => setData('meta_description', e.target.value)}
                                    rows={2}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="flex flex-col gap-5">

                        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                            <h3 className="text-sm font-semibold">Publikasi</h3>

                            <div className="space-y-2">
                                <Label htmlFor="edit-type">Tipe Konten *</Label>
                                <select
                                    id="edit-type"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value as PostType)}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    {types.map((t) => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-status">Status *</Label>
                                <select
                                    id="edit-status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value as PostStatus)}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    {statuses.map((s) => (
                                        <option key={s.value} value={s.value}>{s.label}</option>
                                    ))}
                                </select>
                            </div>

                            {data.status === 'scheduled' && (
                                <div className="space-y-2">
                                    <Label htmlFor="edit-published-at">Waktu Publish</Label>
                                    <Input
                                        id="edit-published-at"
                                        type="datetime-local"
                                        value={data.published_at}
                                        onChange={(e) => setData('published_at', e.target.value)}
                                    />
                                </div>
                            )}

                            <div className="flex flex-col gap-2 pt-2">
                                <Button type="submit" disabled={processing} className="w-full gap-2">
                                    <Send className="h-4 w-4" />
                                    {data.status === 'published' ? 'Update & Publish' : 'Simpan Perubahan'}
                                </Button>
                            </div>
                        </div>

                        {/* Cover Image */}
                        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                            <h3 className="text-sm font-semibold">Cover Image</h3>
                            {post.cover_image && !data.cover_image && (
                                <img
                                    src={`/storage/${post.cover_image}`}
                                    alt="Cover"
                                    className="w-full aspect-video object-cover rounded-lg border border-border"
                                />
                            )}
                            <div
                                className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-4 text-center cursor-pointer hover:border-foreground/30 transition-colors"
                                onClick={() => document.getElementById('edit-cover-input')?.click()}
                            >
                                {data.cover_image ? (
                                    <p className="text-sm font-medium text-green-500">✓ {data.cover_image.name}</p>
                                ) : (
                                    <p className="text-sm text-muted-foreground">{post.cover_image ? 'Klik untuk ganti' : 'Upload cover image'}</p>
                                )}
                            </div>
                            <input
                                id="edit-cover-input"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => setData('cover_image', e.target.files?.[0] ?? null)}
                            />
                        </div>

                        {/* Categories */}
                        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                            <h3 className="text-sm font-semibold">Kategori</h3>
                            {categories.length === 0 ? (
                                <p className="text-xs text-muted-foreground">Belum ada kategori.</p>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {categories.map((cat) => (
                                        <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={data.category_ids.includes(cat.id)}
                                                onChange={() => setData('category_ids', toggleId(data.category_ids, cat.id))}
                                                className="rounded border-border"
                                            />
                                            <span className="text-sm">{cat.name}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Tags */}
                        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                            <h3 className="text-sm font-semibold">Tags</h3>
                            {tags.length === 0 ? (
                                <p className="text-xs text-muted-foreground">Belum ada tag.</p>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag) => (
                                        <button
                                            key={tag.id}
                                            type="button"
                                            onClick={() => setData('tag_ids', toggleId(data.tag_ids, tag.id))}
                                            className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                                                data.tag_ids.includes(tag.id)
                                                    ? 'bg-foreground text-background border-foreground'
                                                    : 'border-border text-muted-foreground hover:text-foreground'
                                            }`}
                                        >
                                            {tag.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

PostEdit.layout = {
    breadcrumbs: [
        { title: 'Kominfo Dashboard', href: dashboard().url },
        { title: 'Post', href: postsIndex().url },
        { title: 'Edit Post', href: '#' },
    ],
};
