<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * @property int $id
 * @property string $name
 * @property bool $is_active
 * @property Carbon|null $start_date
 * @property Carbon|null $end_date
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Period extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'is_active', 'start_date', 'end_date'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    /**
     * Activate the given period and deactivate all other periods inside a transaction.
     */
    public static function activatePeriod(self $period): void
    {
        DB::transaction(function () use ($period) {
            self::where('id', '!=', $period->id)->update(['is_active' => false]);
            $period->update(['is_active' => true]);
        });
    }
}
