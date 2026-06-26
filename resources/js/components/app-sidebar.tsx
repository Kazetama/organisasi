import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Calendar, FileText, FolderGit2, Image, LayoutGrid, Layers, Shield, Users } from 'lucide-react';
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
} from '@/components/ui/sidebar';
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

export function AppSidebar() {
    const { auth } = usePage().props;
    const userRoles = (auth.user?.roles as string[]) || [];

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
                href: '#',
                icon: Calendar,
            },
            {
                title: 'Manajemen Role',
                href: '#',
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

    if (userRoles.includes('admin-kominfo')) {
        mainNavItems.push(
            {
                title: 'Kelola Artikel',
                href: '#',
                icon: FileText,
            },
            {
                title: 'Perpustakaan Media',
                href: '#',
                icon: Image,
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
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
