<?php

namespace App\Http\Controllers;

use App\Models\Keys;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if (request()->isMethod('get')) {
            $keys = $user->keys()
                ->get()
                ->map(fn (Keys $key) => [
                    'id' => $key->id,
                    'key' => $key->key,
                    'fingerprint' => $this->fingerprint($key->key),
                    'label' => $this->label($key->key),
                ]);

            return inertia('dashboard/index', [
                'user' => [
                    'name' => $user->name,
                    'username' => $user->username,
                    'email' => $user->email,
                ],
                'keys' => $keys,
                'publicUrl' => route('public.keys', ['username' => $user->username]),
                'rawKeysUrl' => route('public.raw-keys', ['username' => $user->username]),
            ]);
        }
    }

    public function storeKey(Request $request)
    {
        $validated = $request->validate([
            'key' => ['required', 'string', 'max:20000'],
        ]);

        $key = $this->normalizeKey($validated['key']);
        $hash = $this->keyHash($key);

        if (! $this->isValidPublicKey($key)) {
            throw ValidationException::withMessages([
                'key' => 'Please enter a valid SSH public key.',
            ]);
        }

        $exists = $request->user()
            ->keys()
            ->where('key_hash', $hash)
            ->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'key' => 'This SSH key is already saved for your account.',
            ]);
        }

        $request->user()->keys()->create([
            'key' => $key,
            'key_hash' => $hash,
        ]);

        return back();
    }

    public function updateUsername(Request $request)
    {
        $validated = $request->validate([
            'username' => [
                'required',
                'string',
                'min:3',
                'max:32',
                'regex:/^[A-Za-z0-9_-]+$/',
                Rule::unique('users', 'username')->ignore($request->user()->id),
            ],
        ]);

        $request->user()->update([
            'username' => $validated['username'],
        ]);

        return back();
    }

    public function destroyKey(Request $request, Keys $key)
    {
        abort_unless($key->user_id === $request->user()->id, 404);

        $key->delete();

        return back();
    }

    private function normalizeKey(string $key): string
    {
        return preg_replace('/\s+/', ' ', trim($key));
    }

    private function isValidPublicKey(string $key): bool
    {
        $parts = explode(' ', $key, 3);

        if (count($parts) < 2) {
            return false;
        }

        [$type, $body] = $parts;
        $allowedTypes = [
            'ssh-ed25519',
            'ssh-rsa',
            'ecdsa-sha2-nistp256',
            'ecdsa-sha2-nistp384',
            'ecdsa-sha2-nistp521',
            'sk-ssh-ed25519@openssh.com',
            'sk-ecdsa-sha2-nistp256@openssh.com',
        ];

        if (! in_array($type, $allowedTypes, true)) {
            return false;
        }

        return base64_decode($body, true) !== false;
    }

    private function keyHash(string $key): string
    {
        $parts = explode(' ', $key, 3);

        return hash('sha256', $parts[0].' '.$parts[1]);
    }

    private function label(string $key): string
    {
        $parts = explode(' ', $key, 3);

        return $parts[2] ?? $parts[0];
    }

    private function fingerprint(string $key): string
    {
        $parts = explode(' ', $key, 3);
        $decoded = base64_decode($parts[1] ?? '', true);

        if ($decoded === false) {
            return '';
        }

        return 'SHA256:'.rtrim(strtr(base64_encode(hash('sha256', $decoded, true)), '+/', '-_'), '=');
    }
}
