export interface MediaFile {
    id: number;
    filename: string;
    url: string;
    mime_type: string;
    size: string;
    alt: string | null;
    uploaded_by: string;
    created_at: string;
}

export interface PaginatedFiles {
    data: MediaFile[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}
