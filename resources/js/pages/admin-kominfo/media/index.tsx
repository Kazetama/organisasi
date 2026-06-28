import { Head, useForm, router } from '@inertiajs/react';
import { Image, Trash2, Upload, Copy, Check } from 'lucide-react';
import { useRef } from 'react';
import { useState } from 'react';
import {
    index as mediaIndex,
    store as mediaStore,
    destroy as mediaDestroy,
} from '@/actions/App/Http/Controllers/AdminKominfo/MediaController';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes/admin-kominfo';
import type { MediaFile, PaginatedFiles } from '@/types';

interface Props {
    files: PaginatedFiles;
}

export default function MediaIndex({ files }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [copiedId, setCopiedId] = useState<number | null>(null);

    const { processing } = useForm({});

    function handleFiles(uploadedFiles: FileList | null) {
        if (!uploadedFiles || uploadedFiles.length === 0) {
return;
}

        const formData = new FormData();
        Array.from(uploadedFiles).forEach((file) => {
            formData.append('files[]', file);
        });

        router.post(mediaStore().url, formData, {
            forceFormData: true,
        });
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    }

    function copyUrl(file: MediaFile) {
        navigator.clipboard.writeText(file.url).then(() => {
            setCopiedId(file.id);
            setTimeout(() => setCopiedId(null), 2000);
        });
    }

    function handleDelete(file: MediaFile) {
        if (!confirm(`Hapus file "${file.filename}"?`)) {
return;
}

        router.delete(mediaDestroy(file).url);
    }

    return (
        <>
            <Head title="Media Library" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Media Library</h1>
                        <p className="text-sm text-muted-foreground">{files.total} file</p>
                    </div>
                    <Button
                        size="sm"
                        className="gap-2"
                        onClick={() => inputRef.current?.click()}
                        disabled={processing}
                    >
                        <Upload className="h-4 w-4" />
                        Upload File
                    </Button>
                    <input
                        ref={inputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFiles(e.target.files)}
                    />
                </div>

                {/* Drop Zone */}
                <div
                    className={`rounded-xl border-2 border-dashed transition-colors p-8 text-center ${
                        isDragging
                            ? 'border-foreground/40 bg-accent/50'
                            : 'border-border hover:border-border/80'
                    }`}
                    onDragOver={(e) => {
 e.preventDefault(); setIsDragging(true); 
}}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                >
                    <div className="flex flex-col items-center gap-2 cursor-pointer">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                            <Upload className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium">
                            {isDragging ? 'Lepaskan file di sini' : 'Drag & drop atau klik untuk upload'}
                        </p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, WebP, GIF, SVG · Max 10MB per file</p>
                    </div>
                </div>

                {/* Grid */}
                {files.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
                        <Image className="h-10 w-10 text-muted-foreground/30 mb-4" />
                        <p className="text-sm font-medium">Library kosong</p>
                        <p className="text-xs text-muted-foreground mt-1">Upload gambar untuk memulai.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        {files.data.map((file) => (
                            <div
                                key={file.id}
                                className="group relative rounded-xl border border-border bg-card overflow-hidden hover:border-border/80 transition-all"
                            >
                                <div className="aspect-square bg-muted/40">
                                    <img
                                        src={file.url}
                                        alt={file.alt ?? file.filename}
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                    />
                                </div>

                                {/* Overlay on hover */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="h-8 gap-1.5 text-xs"
                                        onClick={() => copyUrl(file)}
                                    >
                                        {copiedId === file.id ? (
                                            <><Check className="h-3 w-3" /> Disalin!</>
                                        ) : (
                                            <><Copy className="h-3 w-3" /> Salin URL</>
                                        )}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        className="h-8 gap-1.5 text-xs"
                                        onClick={() => handleDelete(file)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                        Hapus
                                    </Button>
                                </div>

                                {/* File info */}
                                <div className="p-2 border-t border-border">
                                    <p className="truncate text-[11px] font-medium" title={file.filename}>{file.filename}</p>
                                    <p className="text-[10px] text-muted-foreground">{file.size}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {files.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1">
                        {files.links.map((link, i) => (
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

MediaIndex.layout = {
    breadcrumbs: [
        { title: 'Kominfo Dashboard', href: dashboard().url },
        { title: 'Media Library', href: mediaIndex().url },
    ],
};
