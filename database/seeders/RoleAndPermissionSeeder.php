<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /** @var User $adminUser */
        User::firstOrCreate(
            ['email' => 'superadmin@hmti.org'],
            [
                'name' => 'Super Admin HMTI',
                'password' => bcrypt('password123'),
                'role' => 'super-admin',
            ]
        );

        /** @var User $psdmUser */
        User::firstOrCreate(
            ['email' => 'psdm@hmti.org'],
            [
                'name' => 'Admin PSDM HMTI',
                'password' => bcrypt('password123'),
                'role' => 'admin-psdm',
            ]
        );

        /** @var User $kominfoUser */
        User::firstOrCreate(
            ['email' => 'kominfo@hmti.org'],
            [
                'name' => 'Admin Kominfo HMTI',
                'password' => bcrypt('password123'),
                'role' => 'admin-kominfo',
            ]
        );
    }
}
