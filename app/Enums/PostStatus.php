<?php

namespace App\Enums;

enum PostStatus: string
{
    case Draft = 'draft';
    case Scheduled = 'scheduled';
    case Published = 'published';

    public function label(): string
    {
        return match ($this) {
            PostStatus::Draft => 'Draft',
            PostStatus::Scheduled => 'Terjadwal',
            PostStatus::Published => 'Dipublikasikan',
        };
    }
}
