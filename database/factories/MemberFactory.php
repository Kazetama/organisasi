<?php

namespace Database\Factories;

use App\Models\Member;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Member>
 */
class MemberFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nim' => fake()->unique()->numerify('2412######'),
            'name' => fake()->name(),
            'angkatan' => fake()->numberBetween(2020, 2026),
            'status' => fake()->randomElement(['aktif', 'demisioner', 'alumni']),
        ];
    }
}
