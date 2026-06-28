import { useHttp } from '@inertiajs/react';
import {
    Code,
    Image as ImageIcon,
    MoreHorizontal,
    Plus,
    Trash2,
    ArrowUp,
    ArrowDown,
    X,
    Check,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export type BlockType = 'paragraph' | 'heading-2' | 'heading-3' | 'code' | 'image' | 'divider';

export interface Block {
    id: string;
    type: BlockType;
    value: string;
    language?: string;
    url?: string;
    caption?: string;
}

interface BlockEditorProps {
    value: string;
    onChange: (val: string) => void;
}

const LANGUAGES = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'php', label: 'PHP' },
    { value: 'python', label: 'Python' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'bash', label: 'Bash/Shell' },
    { value: 'sql', label: 'SQL' },
    { value: 'json', label: 'JSON' },
];

export function BlockEditor({ value, onChange }: BlockEditorProps) {
    const [blocks, setBlocks] = useState<Block[]>(() => {
        if (!value) {
            return [{ id: 'init-1', type: 'paragraph', value: '' }];
        }

        try {
            if (value.startsWith('[') && value.endsWith(']')) {
                const parsed = JSON.parse(value);

                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            }
        } catch {
            // Treat as plain text
        }

        return [{ id: 'init-1', type: 'paragraph', value }];
    });
    const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
    const [showMenuId, setShowMenuId] = useState<string | null>(null);
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [mediaTargetBlockId, setMediaTargetBlockId] = useState<string | null>(null);
    const [mediaFiles, setMediaFiles] = useState<{ id: number; url: string; filename: string }[]>([]);

    const { get, processing } = useHttp({});

    // Save changes to parent state
    const updateParent = (updatedBlocks: Block[]) => {
        setBlocks(updatedBlocks);
        onChange(JSON.stringify(updatedBlocks));
    };

    const addBlock = (type: BlockType, afterId?: string) => {
        const newBlock: Block = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            value: '',
            language: type === 'code' ? 'javascript' : undefined,
            url: type === 'image' ? '' : undefined,
            caption: type === 'image' ? '' : undefined,
        };

        let updated: Block[];

        if (afterId) {
            const index = blocks.findIndex((b) => b.id === afterId);
            updated = [...blocks];
            updated.splice(index + 1, 0, newBlock);
        } else {
            updated = [...blocks, newBlock];
        }

        updateParent(updated);
        setActiveBlockId(newBlock.id);
        setShowMenuId(null);
    };

    const updateBlock = (id: string, fields: Partial<Block>) => {
        const updated = blocks.map((b) => (b.id === id ? { ...b, ...fields } : b));
        updateParent(updated);
    };

    const removeBlock = (id: string) => {
        if (blocks.length === 1) {
            updateParent([{ id: 'init-1', type: 'paragraph', value: '' }]);

            return;
        }

        const updated = blocks.filter((b) => b.id !== id);
        updateParent(updated);
    };

    const moveBlock = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) {
return;
}

        if (direction === 'down' && index === blocks.length - 1) {
return;
}

        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        const updated = [...blocks];
        const temp = updated[index];
        updated[index] = updated[targetIndex];
        updated[targetIndex] = temp;

        updateParent(updated);
    };

    const openMediaLibrary = (blockId: string) => {
        setMediaTargetBlockId(blockId);
        // Fetch files dynamically
        get('/admin-kominfo/api/media', {
            onSuccess: (res: any) => {
                setMediaFiles(res || []);
                setShowMediaModal(true);
            },
        });
    };

    const selectImage = (url: string) => {
        if (mediaTargetBlockId) {
            updateBlock(mediaTargetBlockId, { type: 'image', url, value: '' });
            setShowMediaModal(false);
            setMediaTargetBlockId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="relative min-h-[400px] border border-border bg-card rounded-xl p-6 md:p-8 space-y-4">
                {blocks.map((block, index) => {
                    const isEmpty = block.value === '' && !block.url;

                    return (
                        <div
                            key={block.id}
                            className={`group relative flex items-start gap-4 py-2 px-3 rounded-lg transition-all duration-200 ${
                                activeBlockId === block.id ? 'bg-muted/30 border border-border/40' : 'border border-transparent'
                            }`}
                            onMouseEnter={() => setActiveBlockId(block.id)}
                            onMouseLeave={() => setActiveBlockId(null)}
                        >
                            {/* Left actions: plus button on hover or active */}
                            <div className="absolute -left-12 top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {isEmpty && (
                                    <button
                                        type="button"
                                        onClick={() => setShowMenuId(showMenuId === block.id ? null : block.id)}
                                        className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background hover:border-foreground/30 transition-colors"
                                    >
                                        <Plus className={`h-4 w-4 transition-transform ${showMenuId === block.id ? 'rotate-45' : ''}`} />
                                    </button>
                                )}
                            </div>

                            {/* Floating insertion bubble menu like Medium */}
                            {showMenuId === block.id && (
                                <div className="absolute left-0 -top-12 z-20 flex items-center gap-2 rounded-full border border-border bg-background p-1.5 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
                                    <button
                                        type="button"
                                        onClick={() => openMediaLibrary(block.id)}
                                        title="Tambah Gambar"
                                        className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                    >
                                        <ImageIcon className="h-4.5 w-4.5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => updateBlock(block.id, { type: 'code', value: '', language: 'javascript' })}
                                        title="Tambah Code Block"
                                        className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                    >
                                        <Code className="h-4.5 w-4.5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => updateBlock(block.id, { type: 'divider', value: '---' })}
                                        title="Tambah Divider"
                                        className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                    >
                                        <MoreHorizontal className="h-4.5 w-4.5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowMenuId(null)}
                                        className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}

                            {/* Main block content area */}
                            <div className="flex-1 min-w-0">
                                {block.type === 'paragraph' && (
                                    <textarea
                                        value={block.value}
                                        onChange={(e) => updateBlock(block.id, { value: e.target.value })}
                                        onFocus={() => setActiveBlockId(block.id)}
                                        placeholder="Mulai menulis cerita Anda..."
                                        rows={Math.max(1, block.value.split('\n').length)}
                                        className="w-full resize-none border-0 bg-transparent p-0 text-base leading-relaxed placeholder:text-muted-foreground/50 focus:outline-none focus:ring-0"
                                    />
                                )}

                                {block.type === 'heading-2' && (
                                    <input
                                        value={block.value}
                                        onChange={(e) => updateBlock(block.id, { value: e.target.value })}
                                        onFocus={() => setActiveBlockId(block.id)}
                                        placeholder="Heading 2"
                                        className="w-full border-0 bg-transparent p-0 text-xl font-bold tracking-tight focus:outline-none focus:ring-0"
                                    />
                                )}

                                {block.type === 'heading-3' && (
                                    <input
                                        value={block.value}
                                        onChange={(e) => updateBlock(block.id, { value: e.target.value })}
                                        onFocus={() => setActiveBlockId(block.id)}
                                        placeholder="Heading 3"
                                        className="w-full border-0 bg-transparent p-0 text-lg font-semibold tracking-tight focus:outline-none focus:ring-0"
                                    />
                                )}

                                {block.type === 'code' && (
                                    <div className="relative rounded-lg border border-border bg-muted/50 p-4 font-mono text-sm">
                                        <div className="absolute right-3 top-3 z-10">
                                            <select
                                                value={block.language}
                                                onChange={(e) => updateBlock(block.id, { language: e.target.value })}
                                                className="rounded border border-border bg-background px-2 py-1 text-xs font-sans focus:outline-none"
                                            >
                                                {LANGUAGES.map((l) => (
                                                    <option key={l.value} value={l.value}>{l.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <textarea
                                            value={block.value}
                                            onChange={(e) => updateBlock(block.id, { value: e.target.value })}
                                            onFocus={() => setActiveBlockId(block.id)}
                                            placeholder="// Tulis kode pemrograman di sini..."
                                            rows={Math.max(5, block.value.split('\n').length)}
                                            className="w-full resize-y border-0 bg-transparent p-0 font-mono text-sm leading-relaxed focus:outline-none focus:ring-0"
                                        />
                                    </div>
                                )}

                                {block.type === 'image' && (
                                    <div className="space-y-2 rounded-lg border border-border/60 p-4 bg-muted/20">
                                        {block.url ? (
                                            <div className="relative group/img overflow-hidden rounded-md border border-border max-h-[350px]">
                                                <img src={block.url} alt={block.caption || 'Image'} className="w-full object-cover max-h-[350px]" />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => updateBlock(block.id, { url: '', value: '' })}
                                                    className="absolute right-3 top-3 h-8 w-8 opacity-0 group-hover/img:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => openMediaLibrary(block.id)}
                                                className="flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border py-12 text-center cursor-pointer hover:border-foreground/30 transition-colors bg-background"
                                            >
                                                <ImageIcon className="h-8 w-8 text-muted-foreground/60" />
                                                <p className="text-sm font-medium">Pilih Gambar dari Media Library</p>
                                            </div>
                                        )}
                                        <Input
                                            placeholder="Tulis caption gambar di sini..."
                                            value={block.caption}
                                            onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
                                            className="h-8 text-xs text-muted-foreground text-center border-0 bg-transparent shadow-none focus-visible:ring-0"
                                        />
                                    </div>
                                )}

                                {block.type === 'divider' && (
                                    <div className="py-6 flex items-center justify-center">
                                        <div className="flex gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-border" />
                                            <span className="h-1.5 w-1.5 rounded-full bg-border" />
                                            <span className="h-1.5 w-1.5 rounded-full bg-border" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right side reordering & delete actions */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                                {/* Transform controls */}
                                {block.type !== 'divider' && block.type !== 'image' && block.type !== 'code' && (
                                    <select
                                        value={block.type}
                                        onChange={(e) => updateBlock(block.id, { type: e.target.value as BlockType })}
                                        className="text-xs rounded border border-border bg-background p-1 focus:outline-none"
                                    >
                                        <option value="paragraph">Paragraph</option>
                                        <option value="heading-2">Heading 2</option>
                                        <option value="heading-3">Heading 3</option>
                                    </select>
                                )}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => moveBlock(index, 'up')}
                                    disabled={index === 0}
                                    className="h-7 w-7"
                                >
                                    <ArrowUp className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => moveBlock(index, 'down')}
                                    disabled={index === blocks.length - 1}
                                    className="h-7 w-7"
                                >
                                    <ArrowDown className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeBlock(block.id)}
                                    className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* General insertion controls */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
                <Button type="button" variant="outline" size="sm" onClick={() => addBlock('paragraph')} className="gap-1.5 text-xs">
                    <Plus className="h-3.5 w-3.5" /> Paragraph
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => addBlock('heading-2')} className="gap-1.5 text-xs">
                    <Plus className="h-3.5 w-3.5" /> Heading 2
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => addBlock('heading-3')} className="gap-1.5 text-xs">
                    <Plus className="h-3.5 w-3.5" /> Heading 3
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => addBlock('code')} className="gap-1.5 text-xs">
                    <Code className="h-3.5 w-3.5" /> Code Block
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => addBlock('image')} className="gap-1.5 text-xs">
                    <ImageIcon className="h-3.5 w-3.5" /> Image
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => addBlock('divider')} className="gap-1.5 text-xs">
                    <MoreHorizontal className="h-3.5 w-3.5" /> Divider
                </Button>
            </div>

            {/* Media Selector Modal */}
            <Dialog open={showMediaModal} onOpenChange={setShowMediaModal}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Pilih Gambar dari Media Library</DialogTitle>
                    </DialogHeader>
                    {processing ? (
                        <div className="flex justify-center py-8">Loading...</div>
                    ) : mediaFiles.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">Media library kosong. Upload gambar terlebih dahulu.</div>
                    ) : (
                        <div className="grid gap-3 grid-cols-3 sm:grid-cols-4 md:grid-cols-5">
                            {mediaFiles.map((f) => (
                                <div
                                    key={f.id}
                                    onClick={() => selectImage(f.url)}
                                    className="group relative cursor-pointer aspect-square rounded-md overflow-hidden border border-border hover:border-foreground/30 transition-all"
                                >
                                    <img src={f.url} alt={f.filename} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <Check className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
