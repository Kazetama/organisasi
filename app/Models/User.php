<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property string $role
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'email', 'password', 'role', 'status', 'angkatan'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Check if the user has the given role.
     *
     * @param  string|array<int, string>  $role
     * @param  string|null  $guard
     */
    public function hasRole($role, $guard = null): bool
    {
        if (is_array($role)) {
            return in_array($this->role, $role);
        }

        if (is_string($role)) {
            return $this->role === $role;
        }

        return false;
    }

    /**
     * Check if the user has any of the given roles.
     *
     * @param  mixed  ...$roles
     */
    public function hasAnyRole(...$roles): bool
    {
        $roles = is_array($roles[0] ?? null) ? $roles[0] : $roles;

        foreach ($roles as $role) {
            if ($this->hasRole($role)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get the names of the user's roles.
     *
     * @return Collection<int, string>
     */
    public function getRoleNames(): Collection
    {
        return collect([$this->role]);
    }
}
