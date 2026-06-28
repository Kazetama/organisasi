import { Head, useForm, router } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Save, Send } from 'lucide-react';
import {
    index as postsIndex,
    create as postCreate,
    store as postStore,
} from '@/actions/App/Http/Controllers/AdminKominfo/PostController';
import { BlockEditor } from '@/components/block-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboard } from '@/routes/admin-kominfo';
import type { PostStatus, PostType, SelectOption } from '@/types';

interface Props {
    categories: { id: number; name: string }[];
    tags: { id: number; name: string }[];
    statuses: SelectOption[];
    types: SelectOption[];
}

export default function PostCreate({ categories, tags, statuses, types }: Props) {
    const { data, setData, processing, errors } = useForm({
        title: '',
        type: 'artikel',
        excerpt: '',
        body: '',
        status: 'draft',
        published_at: '',
        cover_image: null as File | null,
        category_ids: [] as number[],
        tag_ids: [] as number[],
        meta_title: '',
        meta_description: '',
    });

    function handleSubmit(e: React.FormEvent, asDraft = false) {
        e.preventDefault();
        router.post(postStore().url, {
            ...data,
            status: asDraft ? 'draft' : data.status,
        }, {
            forceFormData: true,
        });
    }

    function toggleId(list: number[], id: number): number[] {
        return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
    }

    return (
        <>
            <Head title="Tulis Post Baru" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">

                {/* Header */}
                <div className="flex items-center gap-3">
                    <Button asChild variant="ghost" size="sm" className="gap-2 -ml-2">
                        <Link href={postsIndex().url}>
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </Link>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">

                    {/* Main Content */}
                    <div className="lg:col-span-2 flex flex-col gap-5">

                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="post-title">Judul *</Label>
                            <Input
                                id="post-title"
                                placeholder="Tulis judul yang menarik..."
                                value={data.title}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setData((prev) => ({ ...prev, title: val, meta_title: val }));
                                }}
                                className="text-lg font-medium h-12"
                            />
                            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                        </div>

                        {/* Excerpt */}
                        <div className="space-y-2">
                            <Label htmlFor="post-excerpt">Ringkasan <span className="text-muted-foreground text-xs">(opsional)</span></Label>
                            <textarea
                                id="post-excerpt"
                                placeholder="Ringkasan singkat yang muncul di preview..."
                                value={data.excerpt}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setData((prev) => ({ ...prev, excerpt: val, meta_description: val.slice(0, 160) }));
                                }}
                                rows={2}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                            />
                            {errors.excerpt && <p className="text-xs text-destructive">{errors.excerpt}</p>}
                        </div>

                        {/* Body */}
                        <div className="space-y-2 flex flex-col flex-1">
                            <Label htmlFor="post-body">Konten *</Label>
                            <BlockEditor
                                value={data.body}
                                onChange={(val) => setData('body', val)}
                            />
                            {errors.body && <p className="text-xs text-destructive">{errors.body}</p>}
                        </div>

                        {/* SEO */}
                        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                            <h3 className="text-sm font-semibold">SEO</h3>
                            <div className="space-y-2">
                                <Label htmlFor="post-meta-title">Meta Title</Label>
                                <Input
                                    id="post-meta-title"
                                    placeholder="Judul untuk mesin pencari..."
                                    value={data.meta_title}
                                    onChange={(e) => setData('meta_title', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="post-meta-desc">Meta Description</Label>
                                <textarea
                                    id="post-meta-desc"
                                    placeholder="Deskripsi untuk mesin pencari..."
                                    value={data.meta_description}
                                    onChange={(e) => setData('meta_description', e.target.value)}
                                    rows={2}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                                />
                                <p className="text-xs text-muted-foreground text-right">{data.meta_description.length}/500</p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="flex flex-col gap-5">

                        {/* Publish Settings */}
                        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                            <h3 className="text-sm font-semibold">Publikasi</h3>

                            <div className="space-y-2">
                                <Label htmlFor="post-type">Tipe Konten *</Label>
                                <select
                                    id="post-type"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value as PostType)}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    {types.map((t) => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                                {errors.type && <p className="text-xs text-destructive">{errors.type}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="post-status">Status *</Label>
                                <select
                                    id="post-status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value as PostStatus)}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    {statuses.map((s) => (
                                        <option key={s.value} value={s.value}>{s.label}</option>
                                    ))}
                                </select>
                                {errors.status && <p className="text-xs text-destructive">{errors.status}</p>}
                            </div>

                            {data.status === 'scheduled' && (
                                <div className="space-y-2">
                                    <Label htmlFor="post-published-at">Waktu Publish</Label>
                                    <Input
                                        id="post-published-at"
                                        type="datetime-local"
                                        value={data.published_at}
                                        onChange={(e) => setData('published_at', e.target.value)}
                                    />
                                    {errors.published_at && <p className="text-xs text-destructive">{errors.published_at}</p>}
                                </div>
                            )}

                            <div className="flex flex-col gap-2 pt-2">
                                <Button type="submit" disabled={processing} className="w-full gap-2">
                                    <Send className="h-4 w-4" />
                                    {data.status === 'published' ? 'Publish Sekarang' : 'Simpan'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={processing}
                                    className="w-full gap-2"
                                    onClick={(e) => handleSubmit(e, true)}
                                >
                                    <Save className="h-4 w-4" />
                                    Simpan sebagai Draft
                                </Button>
                            </div>
                        </div>

                        {/* Cover Image */}
                        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                            <h3 className="text-sm font-semibold">Cover Image</h3>
                            <div
                                className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-6 text-center cursor-pointer hover:border-foreground/30 transition-colors"
                                onClick={() => document.getElementById('cover-input')?.click()}
                            >
                                {data.cover_image ? (
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-green-500">✓ {data.cover_image.name}</p>
                                        <p className="text-xs text-muted-foreground">Klik untuk ganti</p>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-sm text-muted-foreground">Klik untuk upload gambar</p>
                                        <p className="text-xs text-muted-foreground">PNG, JPG, WebP · Max 5MB</p>
                                    </>
                                )}
                            </div>
                            <input
                                id="cover-input"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => setData('cover_image', e.target.files?.[0] ?? null)}
                            />
                            {errors.cover_image && <p className="text-xs text-destructive">{errors.cover_image}</p>}
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

PostCreate.layout = {
    breadcrumbs: [
        { title: 'Kominfo Dashboard', href: dashboard().url },
        { title: 'Post', href: postsIndex().url },
        { title: 'Tulis Baru', href: postCreate().url },
    ],
};
