import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Calendar,
    CalendarDays,
    ChevronRight,
    FileText,
    FolderGit2,
    FolderOpen,
    Image,
    LayoutGrid,
    Layers,
    Shield,
    Tag,
    Trophy,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { index as categoriesIndex } from '@/actions/App/Http/Controllers/AdminKominfo/CategoryController';
import { index as mediaIndex } from '@/actions/App/Http/Controllers/AdminKominfo/MediaController';
import { index as postsIndex } from '@/actions/App/Http/Controllers/AdminKominfo/PostController';
import { index as tagsIndex } from '@/actions/App/Http/Controllers/AdminKominfo/TagController';
import { index as periodsIndex } from '@/actions/App/Http/Controllers/SuperAdmin/PeriodController';
import { index as rolesIndex } from '@/actions/App/Http/Controllers/SuperAdmin/RoleController';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

const kominfoSubItems = [
    {
        title: 'Artikel',
        href: postsIndex({ query: { type: 'artikel' } }).url,
        icon: FileText,
    },
    {
        title: 'Kegiatan',
        href: postsIndex({ query: { type: 'kegiatan' } }).url,
        icon: CalendarDays,
    },
    {
        title: 'Penghargaan',
        href: postsIndex({ query: { type: 'penghargaan' } }).url,
        icon: Trophy,
    },
    {
        title: 'Kategori',
        href: categoriesIndex().url,
        icon: FolderOpen,
    },
    {
        title: 'Tags',
        href: tagsIndex().url,
        icon: Tag,
    },
    {
        title: 'Media Library',
        href: mediaIndex().url,
        icon: Image,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props;
    const { isCurrentUrl } = useCurrentUrl();
    const userRoles = (auth.user?.roles as string[]) || [];

    const isKominfoActive = kominfoSubItems.some((item) => isCurrentUrl(item.href));
    const [kominfoOpen, setKominfoOpen] = useState(isKominfoActive);

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
    ];

    if (userRoles.includes('super-admin')) {
        mainNavItems.push(
            {
                title: 'Kelola Periode',
                href: periodsIndex().url,
                icon: Calendar,
            },
            {
                title: 'Manajemen Role',
                href: rolesIndex().url,
                icon: Shield,
            },
        );
    }

    if (userRoles.includes('admin-psdm')) {
        mainNavItems.push(
            {
                title: 'Kelola Anggota',
                href: '#',
                icon: Users,
            },
            {
                title: 'Struktur Organisasi',
                href: '#',
                icon: Layers,
            },
        );
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />

                {/* Kominfo — collapsible group */}
                {userRoles.includes('admin-kominfo') && (
                    <SidebarMenu className="px-4 py-0">
                        {/* Semua Post — direct link */}
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={isCurrentUrl(postsIndex().url)}
                                tooltip={{ children: 'Semua Post' }}
                            >
                                <Link href={postsIndex().url} prefetch>
                                    <FileText />
                                    <span>Semua Post</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        {/* Konten — collapsible dropdown */}
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                isActive={isKominfoActive}
                                tooltip={{ children: 'Konten' }}
                                onClick={() => setKominfoOpen((v) => !v)}
                                className="cursor-pointer"
                            >
                                <LayoutGrid />
                                <span>Konten</span>
                                <ChevronRight
                                    className={`ml-auto h-4 w-4 shrink-0 transition-transform duration-200 ${kominfoOpen ? 'rotate-90' : ''}`}
                                />
                            </SidebarMenuButton>

                            {kominfoOpen && (
                                <SidebarMenuSub>
                                    {kominfoSubItems.map((item) => (
                                        <SidebarMenuSubItem key={item.title}>
                                            <SidebarMenuSubButton
                                                asChild
                                                isActive={isCurrentUrl(item.href)}
                                            >
                                                <Link href={item.href} prefetch>
                                                    <item.icon className="h-4 w-4" />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            )}
                        </SidebarMenuItem>
                    </SidebarMenu>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
