<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page()
    {
        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_are_redirected_from_dashboard()
    {
        // Users with 'member' role are redirected to home
        $user = User::factory()->create(['role' => 'member']);
        $this->actingAs($user);

        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('home'));
    }

    public function test_admin_kominfo_is_redirected_to_kominfo_dashboard()
    {
        $user = User::factory()->create(['role' => 'admin-kominfo']);
        $this->actingAs($user);

        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('admin-kominfo.dashboard'));
    }
}
