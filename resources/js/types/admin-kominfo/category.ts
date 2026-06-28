export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    posts_count: number;
}
