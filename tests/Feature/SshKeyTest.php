<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SshKeyTest extends TestCase
{
    use RefreshDatabase;

    private string $publicKey = 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIANQVi8axcoEnNMPj3zFw6/14KPFDhTC+iwdZXaRhuAz test@example.com';

    public function test_user_can_save_key_and_raw_endpoint_returns_it(): void
    {
        $user = User::factory()->create([
            'username' => 'ghostcompiler',
        ]);

        $this->actingAs($user)
            ->post('/dashboard/keys', [
                'key' => "  {$this->publicKey}  ",
            ])
            ->assertRedirect();

        $this->withHeader('User-Agent', 'curl/8.0')
            ->get('/ghostcompiler.keys')
            ->assertOk()
            ->assertHeader('Content-Type', 'text/plain; charset=UTF-8')
            ->assertSeeText($this->publicKey);
    }

    public function test_curl_request_to_public_username_returns_installer(): void
    {
        User::factory()->create([
            'username' => 'ghostcompiler',
        ]);

        $this->withHeader('User-Agent', 'curl/8.0')
            ->get('/ghostcompiler')
            ->assertOk()
            ->assertHeader('Content-Type', 'text/x-shellscript; charset=UTF-8')
            ->assertSee('KEYS_URL="http://localhost/ghostcompiler.keys"', false)
            ->assertSee('authorized_keys');
    }

    public function test_browser_request_to_public_username_returns_command_page(): void
    {
        $user = User::factory()->create([
            'name' => 'Ghost Compiler',
            'username' => 'ghostcompiler',
        ]);

        $user->keys()->create([
            'key' => $this->publicKey,
            'key_hash' => hash('sha256', 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIANQVi8axcoEnNMPj3zFw6/14KPFDhTC+iwdZXaRhuAz'),
        ]);

        $this->withHeader('Accept', 'text/html')
            ->get('/ghostcompiler')
            ->assertOk()
            ->assertSee('public\/show', false)
            ->assertSee('ghostcompiler')
            ->assertSee('curl -sS http:\/\/localhost\/ghostcompiler | bash', false)
            ->assertSee('ghostcompiler.keys');
    }

    public function test_user_can_change_username(): void
    {
        $user = User::factory()->create([
            'username' => 'old-name',
        ]);

        $this->actingAs($user)
            ->patch('/dashboard/username', [
                'username' => 'new-name',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'username' => 'new-name',
        ]);
    }

    public function test_duplicate_key_material_is_rejected(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/dashboard/keys', [
                'key' => $this->publicKey,
            ])
            ->assertRedirect();

        $sameKeyWithDifferentComment = str_replace('test@example.com', 'second@example.com', $this->publicKey);

        $this->actingAs($user)
            ->from('/dashboard')
            ->post('/dashboard/keys', [
                'key' => $sameKeyWithDifferentComment,
            ])
            ->assertRedirect('/dashboard')
            ->assertSessionHasErrors('key');
    }

    public function test_install_endpoint_returns_script_for_existing_user(): void
    {
        User::factory()->create([
            'username' => 'ghostcompiler',
        ]);

        $this->get('/ghostcompiler/install')
            ->assertOk()
            ->assertHeader('Content-Type', 'text/x-shellscript; charset=UTF-8')
            ->assertSee('curl -fsSL')
            ->assertSee('/ghostcompiler.keys')
            ->assertSee('authorized_keys');
    }
}
