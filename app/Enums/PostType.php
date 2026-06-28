<?php

namespace App\Enums;

enum PostType: string
{
    case Artikel = 'artikel';
    case Kegiatan = 'kegiatan';
    case Penghargaan = 'penghargaan';

    public function label(): string
    {
        return match ($this) {
            PostType::Artikel => 'Artikel',
            PostType::Kegiatan => 'Kegiatan',
            PostType::Penghargaan => 'Penghargaan',
        };
    }
}
