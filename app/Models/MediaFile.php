<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $id
 * @property int $user_id
 * @property string $filename
 * @property string $path
 * @property string $disk
 * @property string $mime_type
 * @property int $size
 * @property string|null $alt
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class MediaFile extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'filename', 'path', 'disk', 'mime_type', 'size', 'alt'];

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function url(): string
    {
        return Storage::disk($this->disk)->url($this->path);
    }

    /**
     * Human-readable file size.
     */
    public function humanSize(): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $power = $this->size > 0 ? (int) floor(log($this->size, 1024)) : 0;

        return number_format($this->size / pow(1024, $power), 2).' '.$units[$power];
    }
}
