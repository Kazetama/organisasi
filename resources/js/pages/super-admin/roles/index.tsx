import { Head, router, usePage } from '@inertiajs/react';
import { Search, Shield, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { index as rolesIndex, update as roleUpdate } from '@/actions/App/Http/Controllers/SuperAdmin/RoleController';
import { Input } from '@/components/ui/input';
import { dashboard } from '@/routes/super-admin';
import type { SuperAdminUser, SelectOption } from '@/types';

interface Filters {
    search?: string;
    role?: string;
}

interface PaginatedUsers {
    data: SuperAdminUser[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    users: PaginatedUsers;
    roles: SelectOption[];
    filters: Filters;
}

export default function RolesIndex({ users, roles, filters }: Props) {
    const { auth } = usePage().props;
    const currentUser = auth.user as { id: number };

    const [search, setSearch] = useState(filters.search ?? '');

    function applyFilter(params: Partial<Filters>) {
        router.get(rolesIndex().url, { ...filters, ...params }, { preserveState: true, replace: true });
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        applyFilter({ search });
    }

    function handleRoleChange(user: SuperAdminUser, newRole: string) {
        if (user.id === currentUser.id && newRole !== 'super-admin') {
            alert('Anda tidak bisa menurunkan role akun Anda sendiri!');

            return;
        }

        const roleLabel = roles.find((r) => r.value === newRole)?.label ?? newRole;

        if (!confirm(`Ubah role "${user.name}" menjadi "${roleLabel}"?`)) {
            return;
        }

        router.patch(roleUpdate(user).url, {
            role: newRole,
        });
    }

    return (
        <>
            <Head title="Manajemen Role" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20">
                            <Shield className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Manajemen Role & Hak Akses</h1>
                            <p className="text-sm text-muted-foreground">Tetapkan wewenang kepengurusan dan wewenang admin divisi</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px] max-w-xs">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="role-user-search"
                            placeholder="Cari nama atau email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </form>

                    <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card p-1">
                        <button
                            onClick={() => applyFilter({ role: undefined })}
                            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${!filters.role ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Semua
                        </button>
                        {roles.map((r) => (
                            <button
                                key={r.value}
                                onClick={() => applyFilter({ role: r.value })}
                                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${filters.role === r.value ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Users List */}
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                    {users.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <UserIcon className="h-10 w-10 text-muted-foreground/30 mb-4" />
                            <p className="text-sm font-medium">Tidak ada anggota ditemukan</p>
                            <p className="text-xs text-muted-foreground mt-1">Coba ubah kriteria pencarian atau filter wewenang.</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/30">
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nama Anggota</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Status Keanggotaan</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Hak Akses / Role</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">{user.name}</span>
                                                {user.id === currentUser.id && (
                                                    <span className="rounded bg-red-500/10 text-red-500 border border-red-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">Anda</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-muted-foreground">{user.email}</td>
                                        <td className="px-4 py-4 text-center">
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                                                user.status === 'aktif'
                                                    ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                    : user.status === 'alumni'
                                                    ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                                    : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                                            }`}>
                                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user, e.target.value)}
                                                className="rounded border border-border bg-background px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-ring"
                                            >
                                                {roles.map((r) => (
                                                    <option key={r.value} value={r.value}>{r.label}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {users.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1">
                        {users.links.map((link, i) => (
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

RolesIndex.layout = {
    breadcrumbs: [
        { title: 'Super Admin Dashboard', href: dashboard().url },
        { title: 'Manajemen Role', href: rolesIndex().url },
    ],
};
