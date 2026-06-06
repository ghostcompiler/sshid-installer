<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthRegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_page_can_be_rendered(): void
    {
        $this->get('/auth/register')
            ->assertOk()
            ->assertSee('auth\/register', false);
    }

    public function test_user_can_register_with_username(): void
    {
        $this->post('/auth/register', [
            'name' => 'Ghost Compiler',
            'username' => 'ghostcompiler',
            'email' => 'ghost@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ])->assertRedirect(route('dashboard'));

        $this->assertAuthenticated();
        $this->assertDatabaseHas('users', [
            'name' => 'Ghost Compiler',
            'username' => 'ghostcompiler',
            'email' => 'ghost@example.com',
        ]);
    }

    public function test_username_must_be_unique_when_registering(): void
    {
        User::factory()->create([
            'username' => 'ghostcompiler',
        ]);

        $this->from('/auth/register')
            ->post('/auth/register', [
                'name' => 'New User',
                'username' => 'ghostcompiler',
                'email' => 'new@example.com',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ])
            ->assertRedirect('/auth/register')
            ->assertSessionHasErrors('username');
    }
}
