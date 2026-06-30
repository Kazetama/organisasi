import { Head, Link } from '@inertiajs/react';
import {
    Shield,
    Users,
    Trophy,
    Calendar,
    FileText,
    TrendingUp,
    FolderGit2,
    CalendarDays,
    ChevronRight,
} from 'lucide-react';
import { index as periodsIndex } from '@/actions/App/Http/Controllers/SuperAdmin/PeriodController';
import { index as rolesIndex } from '@/actions/App/Http/Controllers/SuperAdmin/RoleController';
import { dashboard } from '@/routes/super-admin';
import type { SuperAdminDashboardStats, AngkatanStat } from '@/types';

interface Props {
    stats: SuperAdminDashboardStats;
    angkatan_stats: AngkatanStat[];
    active_period: string;
}

export default function SuperAdminDashboard({ stats, angkatan_stats, active_period }: Props) {
    const totalMembers = stats.members_aktif + stats.members_alumni + stats.members_demisioner;

    return (
        <>
            <Head title="Super Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20">
                            <Shield className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Dashboard Super Admin</h1>
                            <p className="text-sm text-muted-foreground">Kelola periode, roles, dan statistik eksekutif HMTI</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5 mr-1" />
                        Periode Aktif: <span className="text-foreground ml-1">{active_period}</span>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        label="Total Anggota"
                        value={totalMembers}
                        description={`${stats.members_aktif} Aktif · ${stats.members_alumni} Alumni`}
                        icon={<Users className="h-4 w-4" />}
                        color="red"
                    />
                    <StatCard
                        label="Published Post"
                        value={stats.published_posts}
                        description={`Dari ${stats.total_posts} total artikel`}
                        icon={<FileText className="h-4 w-4" />}
                        color="blue"
                    />
                    <StatCard
                        label="Anggota Aktif"
                        value={stats.members_aktif}
                        description="Mahasiswa aktif kepengurusan"
                        icon={<TrendingUp className="h-4 w-4" />}
                        color="green"
                    />
                    <StatCard
                        label="Demisioner"
                        value={stats.members_demisioner}
                        description="Mantan pengurus terdata"
                        icon={<Trophy className="h-4 w-4" />}
                        color="purple"
                    />
                </div>

                {/* Quick Actions + Angkatan Distribution */}
                <div className="grid gap-6 lg:grid-cols-3">

                    {/* Quick Control Center */}
                    <div className="rounded-xl border border-border bg-card p-5">
                        <h2 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Pusat Kontrol</h2>
                        <div className="flex flex-col gap-2">
                            <QuickAction
                                href={periodsIndex().url}
                                icon={<Calendar className="h-4 w-4" />}
                                label="Kelola Periode Kepengurusan"
                                description="CRUD tahun kepengurusan & aktifkan periode"
                                color="red"
                            />
                            <QuickAction
                                href={rolesIndex().url}
                                icon={<Shield className="h-4 w-4" />}
                                label="Manajemen Role & Hak Akses"
                                description="Atur admin-psdm, admin-kominfo, dll."
                                color="purple"
                            />
                        </div>
                    </div>

                    {/* Angkatan Stats */}
                    <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
                        <h2 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Demografi Angkatan</h2>
                        {angkatan_stats.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <FolderGit2 className="h-8 w-8 text-muted-foreground/40 mb-3" />
                                <p className="text-sm text-muted-foreground">Belum ada data demografi angkatan.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {angkatan_stats.map((stat) => {
                                    const percent = totalMembers > 0 ? (stat.total / totalMembers) * 100 : 0;

                                    return (
                                        <div key={stat.angkatan} className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-semibold">Angkatan {stat.angkatan}</span>
                                                <span className="text-muted-foreground">{stat.total} orang ({percent.toFixed(1)}%)</span>
                                            </div>
                                            <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-red-500 transition-all duration-500"
                                                    style={{ width: `${percent}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
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
    description,
    icon,
    color,
}: {
    label: string;
    value: number;
    description: string;
    icon: React.ReactNode;
    color: string;
}) {
    const colorMap: Record<string, string> = {
        red: 'bg-red-500/10 text-red-500 border-red-500/20',
        blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        green: 'bg-green-500/10 text-green-500 border-green-500/20',
        purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    };

    return (
        <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-2xl font-bold tracking-tight">{value}</p>
                    <p className="mt-0.5 text-sm font-semibold">{label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{description}</p>
                </div>
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg border ${colorMap[color]}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

function QuickAction({
    href,
    icon,
    label,
    description,
    color,
}: {
    href: string;
    icon: React.ReactNode;
    label: string;
    description: string;
    color: string;
}) {
    const colorMap: Record<string, string> = {
        red: 'bg-red-500/10 text-red-500 border-red-500/20 group-hover:bg-red-500/20',
        purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20 group-hover:bg-purple-500/20',
    };

    return (
        <Link
            href={href}
            className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 hover:border-border/80 hover:bg-accent/50 transition-all"
        >
            <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${colorMap[color]} transition-colors`}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </Link>
    );
}

SuperAdminDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Super Admin Dashboard',
            href: dashboard().url,
        },
    ],
};
