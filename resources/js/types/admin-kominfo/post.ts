export type PostStatus = 'draft' | 'scheduled' | 'published';
export type PostType = 'artikel' | 'kegiatan' | 'penghargaan';

export interface Author {
    id: number;
    name: string;
}

export interface PostCategory {
    id: number;
    name: string;
}

export interface PostTag {
    id: number;
    name: string;
}

export interface Post {
    id: number;
    title: string;
    slug: string;
    type: PostType;
    status: PostStatus;
    reading_time: number;
    body: string;
    excerpt: string | null;
    cover_image: string | null;
    published_at: string | null;
    meta_title: string | null;
    meta_description: string | null;
    created_at: string;
    author: Author;
    categories: PostCategory[];
    tags: PostTag[];
}

export interface RecentPost {
    id: number;
    title: string;
    type: PostType;
    status: PostStatus;
    published_at: string | null;
    created_at: string;
}

export interface PaginatedPosts {
    data: Post[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

export interface PostFilters {
    status?: string;
    type?: string;
    search?: string;
}

export interface SelectOption {
    value: string;
    label: string;
}

export interface Stats {
    total_posts: number;
    published: number;
    drafts: number;
    scheduled: number;
    categories: number;
    tags: number;
    media_files: number;
}
