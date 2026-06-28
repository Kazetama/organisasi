import { Head, Link, router } from '@inertiajs/react';
import {
    CalendarDays,
    FileText,
    MoreHorizontal,
    Pencil,
    Plus,
    Search,
    Trash2,
    Trophy,
    Clock,
} from 'lucide-react';
import { useState } from 'react';
import {
    index as postsIndex,
    create as postCreate,
    edit as postEdit,
    destroy as postDestroy,
} from '@/actions/App/Http/Controllers/AdminKominfo/PostController';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { dashboard } from '@/routes/admin-kominfo';
import type { PostStatus, PostType, Post, PaginatedPosts, SelectOption, PostFilters } from '@/types';

interface Props {
    posts: PaginatedPosts;
    filters: PostFilters;
    statuses: SelectOption[];
    types: SelectOption[];
}

const typeConfig: Record<PostType, { label: string; icon: React.ReactNode; cls: string }> = {
    artikel: { label: 'Artikel', icon: <FileText className="h-3 w-3" />, cls: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    kegiatan: { label: 'Kegiatan', icon: <CalendarDays className="h-3 w-3" />, cls: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
    penghargaan: { label: 'Penghargaan', icon: <Trophy className="h-3 w-3" />, cls: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
};

const statusConfig: Record<PostStatus, { label: string; cls: string }> = {
    draft: { label: 'Draft', cls: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' },
    scheduled: { label: 'Terjadwal', cls: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
    published: { label: 'Published', cls: 'bg-green-500/10 text-green-500 border-green-500/20' },
};

export default function PostsIndex({ posts, filters, statuses, types }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    function applyFilter(params: Partial<PostFilters>) {
        router.get(postsIndex().url, { ...filters, ...params }, { preserveState: true, replace: true });
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        applyFilter({ search });
    }

    function handleDelete(post: Post) {
        if (!confirm(`Hapus post "${post.title}"? Tindakan ini tidak bisa dibatalkan.`)) {
            return;
        }

        router.delete(postDestroy(post).url);
    }

    return (
        <>
            <Head title="Kelola Post" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Kelola Post</h1>
                        <p className="text-sm text-muted-foreground">{posts.total} post total</p>
                    </div>
                    <Button asChild size="sm" className="gap-2">
                        <Link href={postCreate().url}>
                            <Plus className="h-4 w-4" />
                            Post Baru
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px] max-w-xs">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="post-search"
                            placeholder="Cari judul..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </form>

                    {/* Type filter */}
                    <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card p-1">
                        <button
                            onClick={() => applyFilter({ type: undefined })}
                            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${!filters.type ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Semua
                        </button>
                        {types.map((t) => (
                            <button
                                key={t.value}
                                onClick={() => applyFilter({ type: t.value })}
                                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${filters.type === t.value ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* Status filter */}
                    <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card p-1">
                        <button
                            onClick={() => applyFilter({ status: undefined })}
                            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${!filters.status ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Semua
                        </button>
                        {statuses.map((s) => (
                            <button
                                key={s.value}
                                onClick={() => applyFilter({ status: s.value })}
                                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${filters.status === s.value ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                    {posts.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <FileText className="h-10 w-10 text-muted-foreground/30 mb-4" />
                            <p className="text-sm font-medium">Tidak ada post ditemukan</p>
                            <p className="text-xs text-muted-foreground mt-1">Coba ubah filter atau buat post baru.</p>
                            <Button asChild size="sm" variant="outline" className="mt-4">
                                <Link href={postCreate().url}>Buat Post Baru</Link>
                            </Button>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/30">
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Judul</th>
                                    <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Tipe</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                                    <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Penulis</th>
                                    <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Baca</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {posts.data.map((post) => {
                                    const type = typeConfig[post.type];
                                    const status = statusConfig[post.status];

                                    return (
                                        <tr key={post.id} className="hover:bg-muted/20 transition-colors">
                                            <td className="px-4 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-medium line-clamp-1">{post.title}</span>
                                                    {post.categories.length > 0 && (
                                                        <div className="flex flex-wrap gap-1">
                                                            {post.categories.slice(0, 2).map((cat) => (
                                                                <span key={cat.id} className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">{cat.name}</span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="hidden sm:table-cell px-4 py-4">
                                                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${type.cls}`}>
                                                    {type.icon}{type.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${status.cls}`}>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="hidden md:table-cell px-4 py-4 text-muted-foreground">{post.author.name}</td>
                                            <td className="hidden lg:table-cell px-4 py-4 text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {post.reading_time}m
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={postEdit(post).url} className="flex items-center gap-2">
                                                                <Pencil className="h-3.5 w-3.5" />
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(post)}
                                                            className="flex items-center gap-2 text-destructive focus:text-destructive"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                            Hapus
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {posts.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1">
                        {posts.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                                    link.active
                                        ? 'bg-foreground text-background font-medium'
                                        : link.url
                                        ? 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                        : 'cursor-not-allowed text-muted-foreground/40'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

PostsIndex.layout = {
    breadcrumbs: [
        { title: 'Kominfo Dashboard', href: dashboard().url },
        { title: 'Post', href: postsIndex().url },
    ],
};
