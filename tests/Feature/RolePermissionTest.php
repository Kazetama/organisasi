<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RolePermissionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RoleAndPermissionSeeder::class);
    }

    /**
     * Test that seeded users have their corresponding roles.
     */
    public function test_seeded_users_have_correct_roles(): void
    {
        /** @var User $superAdmin */
        $superAdmin = User::where('email', 'superadmin@hmti.org')->first();
        $this->assertNotNull($superAdmin);
        $this->assertTrue($superAdmin->hasRole('super-admin'));
        $this->assertFalse($superAdmin->hasRole('admin-psdm'));
        $this->assertTrue($superAdmin->hasAnyRole(['super-admin', 'admin-psdm']));
        $this->assertEquals(['super-admin'], $superAdmin->getRoleNames()->toArray());

        /** @var User $adminPsdm */
        $adminPsdm = User::where('email', 'psdm@hmti.org')->first();
        $this->assertNotNull($adminPsdm);
        $this->assertTrue($adminPsdm->hasRole('admin-psdm'));
        $this->assertFalse($adminPsdm->hasRole('super-admin'));

        /** @var User $adminKominfo */
        $adminKominfo = User::where('email', 'kominfo@hmti.org')->first();
        $this->assertNotNull($adminKominfo);
        $this->assertTrue($adminKominfo->hasRole('admin-kominfo'));
        $this->assertFalse($adminKominfo->hasRole('admin-psdm'));
    }
}
