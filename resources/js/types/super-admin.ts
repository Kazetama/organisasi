export interface Period {
    id: number;
    name: string;
    is_active: boolean;
    start_date: string | null;
    end_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface SuperAdminUser {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    angkatan: number | null;
    created_at: string;
}

export interface SuperAdminDashboardStats {
    members_aktif: number;
    members_alumni: number;
    members_demisioner: number;
    total_posts: number;
    published_posts: number;
    draft_posts: number;
}

export interface AngkatanStat {
    angkatan: number;
    total: number;
}
