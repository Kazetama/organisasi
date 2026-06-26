import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { dashboard } from '@/routes/admin-kominfo';
import { FileText } from 'lucide-react';

export default function AdminKominfoDashboard() {
    return (
        <>
            <Head title="Kominfo Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">

                {/* Role Identity Header */}
                <div className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                        <FileText className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-green-500">Admin Kominfo</p>
                        <p className="text-muted-foreground text-xs">CMS Blog & Publikasi · Tulis artikel, kelola media dan kategori konten</p>
                    </div>
                </div>

                {/* Stat Placeholders */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>

                {/* Main Content Placeholder */}
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </>
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
