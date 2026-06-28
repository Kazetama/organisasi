import { Head, Link } from '@inertiajs/react';
import {
    FileText,
    Globe,
    Tag,
    FolderOpen,
    Image,
    CalendarDays,
    Trophy,
    Plus,
    Clock,
    TrendingUp,
} from 'lucide-react';
import { index as categoriesIndex } from '@/actions/App/Http/Controllers/AdminKominfo/CategoryController';
import { index as mediaIndex } from '@/actions/App/Http/Controllers/AdminKominfo/MediaController';
import { index as postsIndex } from '@/actions/App/Http/Controllers/AdminKominfo/PostController';
import { create as postCreate } from '@/actions/App/Http/Controllers/AdminKominfo/PostController';
import { index as tagsIndex } from '@/actions/App/Http/Controllers/AdminKominfo/TagController';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes/admin-kominfo';
import type { PostStatus, PostType, RecentPost, Stats } from '@/types';

interface Props {
    stats: Stats;
    recent_posts: RecentPost[];
}

const typeConfig: Record<PostType, { label: string; icon: React.ReactNode; color: string }> = {
    artikel: { label: 'Artikel', icon: <FileText className="h-3 w-3" />, color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    kegiatan: { label: 'Kegiatan', icon: <CalendarDays className="h-3 w-3" />, color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
    penghargaan: { label: 'Penghargaan', icon: <Trophy className="h-3 w-3" />, color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
};

const statusConfig: Record<PostStatus, { label: string; color: string }> = {
    draft: { label: 'Draft', color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' },
    scheduled: { label: 'Terjadwal', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
    published: { label: 'Published', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
};

export default function AdminKominfoDashboard({ stats, recent_posts }: Props) {
    return (
        <>
            <Head title="Kominfo Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 border border-green-500/20">
                            <TrendingUp className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Dashboard Kominfo</h1>
                            <p className="text-sm text-muted-foreground">Kelola konten publikasi HMTI</p>
                        </div>
                    </div>
                    <Button asChild size="sm" className="gap-2">
                        <Link href={postCreate().url}>
                            <Plus className="h-4 w-4" />
                            Tulis Post Baru
                        </Link>
                    </Button>
                </div>

                {/* Stat Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        label="Total Post"
                        value={stats.total_posts}
                        icon={<FileText className="h-4 w-4" />}
                        color="green"
                        href={postsIndex().url}
                    />
                    <StatCard
                        label="Published"
                        value={stats.published}
                        icon={<Globe className="h-4 w-4" />}
                        color="blue"
                        href={postsIndex({ query: { status: 'published' } }).url}
                    />
                    <StatCard
                        label="Draft"
                        value={stats.drafts}
                        icon={<Clock className="h-4 w-4" />}
                        color="zinc"
                        href={postsIndex({ query: { status: 'draft' } }).url}
                    />
                    <StatCard
                        label="Media Files"
                        value={stats.media_files}
                        icon={<Image className="h-4 w-4" />}
                        color="purple"
                        href={mediaIndex().url}
                    />
                </div>

                {/* Quick Actions + Recent Posts */}
                <div className="grid gap-6 lg:grid-cols-3">

                    {/* Quick Actions */}
                    <div className="rounded-xl border border-border bg-card p-5">
                        <h2 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Aksi Cepat</h2>
                        <div className="flex flex-col gap-2">
                            <QuickAction
                                href={postCreate({ query: { type: 'artikel' } }).url}
                                icon={<FileText className="h-4 w-4" />}
                                label="Tulis Artikel"
                                color="blue"
                            />
                            <QuickAction
                                href={postCreate({ query: { type: 'kegiatan' } }).url}
                                icon={<CalendarDays className="h-4 w-4" />}
                                label="Laporan Kegiatan"
                                color="purple"
                            />
                            <QuickAction
                                href={postCreate({ query: { type: 'penghargaan' } }).url}
                                icon={<Trophy className="h-4 w-4" />}
                                label="Catat Penghargaan"
                                color="amber"
                            />
                            <QuickAction
                                href={categoriesIndex().url}
                                icon={<FolderOpen className="h-4 w-4" />}
                                label={`Kategori (${stats.categories})`}
                                color="green"
                            />
                            <QuickAction
                                href={tagsIndex().url}
                                icon={<Tag className="h-4 w-4" />}
                                label={`Tags (${stats.tags})`}
                                color="orange"
                            />
                            <QuickAction
                                href={mediaIndex().url}
                                icon={<Image className="h-4 w-4" />}
                                label="Media Library"
                                color="pink"
                            />
                        </div>
                    </div>

                    {/* Recent Posts */}
                    <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Post Terbaru</h2>
                            <Link href={postsIndex().url} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                                Lihat semua →
                            </Link>
                        </div>
                        {recent_posts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <FileText className="h-8 w-8 text-muted-foreground/40 mb-3" />
                                <p className="text-sm text-muted-foreground">Belum ada post.</p>
                                <Button asChild size="sm" variant="outline" className="mt-3">
                                    <Link href={postCreate().url}>Buat yang pertama</Link>
                                </Button>
                            </div>
                        ) : (
                            <ul className="divide-y divide-border">
                                {recent_posts.map((post) => {
                                    const type = typeConfig[post.type];
                                    const status = statusConfig[post.status];

                                    return (
                                        <li key={post.id} className="flex items-center gap-3 py-3">
                                            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${type.color}`}>
                                                {type.icon}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium">{post.title}</p>
                                                <p className="text-xs text-muted-foreground">{type.label}</p>
                                            </div>
                                            <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

function StatCard({
    label,
    value,
    icon,
    color,
    href,
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    href: string;
}) {
    const colorMap: Record<string, string> = {
        green: 'bg-green-500/10 text-green-500 border-green-500/20',
        blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        zinc: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
        purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    };

    return (
        <Link href={href} className="group block rounded-xl border border-border bg-card p-5 hover:border-border/80 hover:bg-accent/50 transition-all">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-2xl font-bold tracking-tight">{value}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{label}</p>
                </div>
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg border ${colorMap[color]}`}>
                    {icon}
                </div>
            </div>
        </Link>
    );
}

function QuickAction({
    href,
    icon,
    label,
    color,
}: {
    href: string;
    icon: React.ReactNode;
    label: string;
    color: string;
}) {
    const colorMap: Record<string, string> = {
        blue: 'text-blue-500',
        purple: 'text-purple-500',
        amber: 'text-amber-500',
        green: 'text-green-500',
        orange: 'text-orange-500',
        pink: 'text-pink-500',
    };

    return (
        <Link
            href={href}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
        >
            <span className={colorMap[color]}>{icon}</span>
            {label}
        </Link>
    );
}

AdminKominfoDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Kominfo Dashboard',
            href: dashboard().url,
        },
    ],
};
