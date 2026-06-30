<?php

namespace Tests\Feature;

use App\Models\Member;
use App\Models\Period;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SuperAdminTest extends TestCase
{
    use RefreshDatabase;

    protected User $superAdmin;

    protected User $member;

    protected function setUp(): void
    {
        parent::setUp();

        $this->superAdmin = User::factory()->create(['role' => 'super-admin']);
        $this->member = User::factory()->create(['role' => 'member']);
    }

    public function test_guests_cannot_access_super_admin_pages()
    {
        $this->get(route('super-admin.dashboard'))->assertRedirect(route('login'));
        $this->get(route('super-admin.periods.index'))->assertRedirect(route('login'));
        $this->get(route('super-admin.roles.index'))->assertRedirect(route('login'));
    }

    public function test_members_cannot_access_super_admin_pages()
    {
        $this->actingAs($this->member);

        $this->get(route('super-admin.dashboard'))->assertRedirect(route('dashboard'));
        $this->get(route('super-admin.periods.index'))->assertRedirect(route('dashboard'));
        $this->get(route('super-admin.roles.index'))->assertRedirect(route('dashboard'));
    }

    public function test_super_admin_can_access_executive_dashboard()
    {
        // Seed Member statistics
        Member::factory()->count(3)->create(['status' => 'aktif', 'angkatan' => 2024]);
        Member::factory()->count(2)->create(['status' => 'alumni', 'angkatan' => 2022]);
        Member::factory()->count(1)->create(['status' => 'demisioner', 'angkatan' => 2023]);

        $this->actingAs($this->superAdmin);

        $response = $this->get(route('super-admin.dashboard'));
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('super-admin/dashboard')
            ->where('stats.members_aktif', 3)
            ->where('stats.members_alumni', 2)
            ->where('stats.members_demisioner', 1)
        );
    }

    public function test_super_admin_can_manage_periods()
    {
        $this->actingAs($this->superAdmin);

        // 1. Create Period
        $response = $this->post(route('super-admin.periods.store'), [
            'name' => 'Periode 2026/2027',
            'start_date' => '2026-06-01',
            'end_date' => '2027-05-31',
        ]);
        $response->assertRedirect(route('super-admin.periods.index'));
        $this->assertDatabaseHas('periods', ['name' => 'Periode 2026/2027', 'is_active' => false]);

        $period = Period::first();

        // 2. Edit Period
        $response = $this->patch(route('super-admin.periods.update', $period), [
            'name' => 'Periode 2026/2027 V2',
            'start_date' => '2026-06-01',
            'end_date' => '2027-05-31',
        ]);
        $response->assertRedirect(route('super-admin.periods.index'));
        $this->assertDatabaseHas('periods', ['name' => 'Periode 2026/2027 V2']);

        // 3. Toggle Active (sets to active)
        $anotherPeriod = Period::create(['name' => 'Periode 2027/2028', 'is_active' => true]);

        $response = $this->post(route('super-admin.periods.toggle', $period));
        $response->assertRedirect(route('super-admin.periods.index'));

        $this->assertTrue($period->fresh()->is_active);
        $this->assertFalse($anotherPeriod->fresh()->is_active);

        // 4. Delete Active Period fails
        $response = $this->delete(route('super-admin.periods.destroy', $period));
        $response->assertRedirect(route('super-admin.periods.index'));
        $this->assertDatabaseHas('periods', ['id' => $period->id]);

        // 5. Delete Inactive Period succeeds
        $response = $this->delete(route('super-admin.periods.destroy', $anotherPeriod));
        $response->assertRedirect(route('super-admin.periods.index'));
        $this->assertDatabaseMissing('periods', ['id' => $anotherPeriod->id]);
    }

    public function test_super_admin_can_manage_roles()
    {
        $this->actingAs($this->superAdmin);

        // 1. Visit Roles page
        $response = $this->get(route('super-admin.roles.index'));
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('super-admin/roles/index'));

        // 2. Change Member to Admin PSDM
        $response = $this->patch(route('super-admin.roles.update', $this->member), [
            'role' => 'admin-psdm',
        ]);
        $response->assertRedirect(route('super-admin.roles.index'));
        $this->assertEquals('admin-psdm', $this->member->fresh()->role);

        // 3. Prevent Self Demotion
        $response = $this->patch(route('super-admin.roles.update', $this->superAdmin), [
            'role' => 'member',
        ]);
        $this->assertEquals('super-admin', $this->superAdmin->fresh()->role);
    }
}
