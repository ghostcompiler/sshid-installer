<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PublicKeyController extends Controller
{
    public function keys(Request $request, string $username)
    {
        $user = User::query()
            ->where('username', $username)
            ->with('keys')
            ->firstOrFail();

        if ($this->shouldShowPage($request)) {
            return inertia('public/show', [
                'profile' => [
                    'name' => $user->name,
                    'username' => $user->username,
                    'keyCount' => $user->keys->count(),
                ],
                'installCommand' => 'curl -sS '.route('public.keys', ['username' => $user->username]).' | bash',
                'rawCommand' => 'curl -sS '.route('public.raw-keys', ['username' => $user->username]).' >> ~/.ssh/authorized_keys',
                'publicUrl' => route('public.keys', ['username' => $user->username]),
                'rawKeysUrl' => route('public.raw-keys', ['username' => $user->username]),
            ]);
        }

        return $this->install($username);
    }

    public function rawKeys(string $username): Response
    {
        $user = User::query()
            ->where('username', $username)
            ->with('keys')
            ->firstOrFail();

        $keys = $user->keys
            ->pluck('key')
            ->filter()
            ->implode("\n");

        return response($keys === '' ? '' : $keys."\n", 200)
            ->header('Content-Type', 'text/plain; charset=UTF-8');
    }

    public function install(string $username): Response
    {
        User::query()
            ->where('username', $username)
            ->firstOrFail();

        $keysUrl = route('public.raw-keys', ['username' => $username]);
        $script = <<<'BASH'
#!/usr/bin/env bash
set -euo pipefail

KEYS_URL="__KEYS_URL__"
SSH_DIR="${HOME}/.ssh"
AUTHORIZED_KEYS="${SSH_DIR}/authorized_keys"
TMP_KEYS="$(mktemp)"
VALID_KEYS="$(mktemp)"

cleanup() {
  rm -f "$TMP_KEYS" "$VALID_KEYS"
}
trap cleanup EXIT

mkdir -p "$SSH_DIR"
touch "$AUTHORIZED_KEYS"
chmod 700 "$SSH_DIR"
chmod 600 "$AUTHORIZED_KEYS"

if command -v curl >/dev/null 2>&1; then
  curl -fsSL "$KEYS_URL" -o "$TMP_KEYS"
elif command -v wget >/dev/null 2>&1; then
  wget -qO "$TMP_KEYS" "$KEYS_URL"
else
  echo "curl or wget is required to install SSH keys." >&2
  exit 1
fi

if [ ! -s "$TMP_KEYS" ]; then
  echo "No SSH keys were found at $KEYS_URL." >&2
  exit 1
fi

installed=0
skipped=0

while IFS= read -r key || [ -n "$key" ]; do
  key="$(printf '%s' "$key" | sed 's/[[:space:]]*$//')"
  [ -z "$key" ] && continue

  printf '%s\n' "$key" > "$VALID_KEYS"
  if ! ssh-keygen -l -f "$VALID_KEYS" >/dev/null 2>&1; then
    echo "Skipping invalid SSH public key: ${key%% *}" >&2
    skipped=$((skipped + 1))
    continue
  fi

  if grep -qxF "$key" "$AUTHORIZED_KEYS"; then
    skipped=$((skipped + 1))
    continue
  fi

  if [ -s "$AUTHORIZED_KEYS" ] && [ "$(tail -c 1 "$AUTHORIZED_KEYS")" != "" ]; then
    printf '\n' >> "$AUTHORIZED_KEYS"
  fi

  printf '%s\n' "$key" >> "$AUTHORIZED_KEYS"
  installed=$((installed + 1))
done < "$TMP_KEYS"

echo "SSH keys installed: $installed, already present or skipped: $skipped"
BASH;

        $script = str_replace('__KEYS_URL__', $keysUrl, $script);

        return response($script."\n", 200)
            ->header('Content-Type', 'text/x-shellscript; charset=UTF-8');
    }

    private function shouldShowPage(Request $request): bool
    {
        $agent = strtolower($request->userAgent() ?? '');

        foreach (['curl', 'wget', 'httpie', 'python-requests', 'go-http-client'] as $client) {
            if (str_contains($agent, $client)) {
                return false;
            }
        }

        return $request->acceptsHtml();
    }
}
