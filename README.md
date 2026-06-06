<p align="center">
  <img src="https://res.cloudinary.com/djgvfl1tv/image/upload/v1780666791/logo_mqnqn4.png" alt="Ghost Compiler" width="180">
</p>

<h1 align="center">SSHID Installer</h1>

<p align="center">
  SSHID is a self-hosted hub for SSH public keys. Save your keys once, share a memorable URL, and authorize them on any server with one command — no manual copying, no duplicate <code>authorized_keys</code> entries, and no need to pass private keys around.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-13-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel">
  <img src="https://img.shields.io/badge/PHP-8.3+-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Inertia.js-Frontend-9333EA?style=for-the-badge" alt="Inertia.js">
  <img src="https://img.shields.io/badge/SSH-Public%20Keys-0EA5E9?style=for-the-badge" alt="SSH">
  <img src="https://img.shields.io/badge/Built%20By-Ghost%20Compiler-0F172A?style=for-the-badge" alt="Ghost Compiler">
</p>

---

Instead of copying public keys manually between machines, a user can save their public SSH keys once in SSHID and then install them on a server with a short command:

```bash
curl -sS https://ssh.hsp.ovh/username | bash
```

For example:

```bash
curl -sS https://ssh.hsp.ovh/ghostcompiler | bash
```

The public browser page at the same URL shows a polished command page with copy buttons. Command-line clients receive an installer script.

## What This Project Is For

SSHID makes SSH key distribution easier for developers, server admins, and teams who frequently need to authorize the same public keys on new servers.

Use it to:

- Store SSH public keys under a user account.
- Share a memorable public install URL.
- Install saved SSH keys on a server with one command.
- Avoid duplicate entries in `~/.ssh/authorized_keys`.
- Keep the private SSH key on the user's machine.

SSHID only stores public keys. It should never receive or store private keys.

## Main Features

- User registration and login.
- Custom public username for each account.
- Dashboard for adding, listing, and deleting SSH public keys.
- SSH public key validation before saving.
- Duplicate key detection using a stable key hash.
- Public command page at `/{username}` for browsers.
- Bash installer script at `/{username}` for command-line clients such as `curl`.
- Raw key endpoint at `/{username}.keys`.
- Legacy installer endpoint at `/{username}/install`.
- Installer creates `~/.ssh`, fixes permissions, validates fetched keys, and skips keys already present in `authorized_keys`.

## How It Works

For a browser request:

```text
https://ssh.hsp.ovh/ghostcompiler
```

SSHID shows a public page with commands and copy buttons.

For a command-line request:

```bash
curl -sS https://ssh.hsp.ovh/ghostcompiler | bash
```

SSHID returns a bash installer script. The script fetches:

```text
https://ssh.hsp.ovh/ghostcompiler.keys
```

Then it appends missing valid public keys to:

```text
~/.ssh/authorized_keys
```

## Tech Stack

- Laravel 13
- PHP 8.3+
- Inertia.js
- React 19
- Vite
- Tailwind CSS
- shadcn-style UI components
- SQLite or any Laravel-supported database

## Requirements

- PHP 8.3 or newer
- Composer
- Node.js and npm
- SQLite, MySQL, PostgreSQL, or another Laravel-supported database

## Local Setup

Clone the repository:

```bash
git clone <repository-url>
cd ssh
```

Install PHP dependencies:

```bash
composer install
```

Install JavaScript dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Generate the application key:

```bash
php artisan key:generate
```

Create the database if you are using SQLite:

```bash
touch database/database.sqlite
```

Update `.env` for SQLite:

```env
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database/database.sqlite
```

Run migrations:

```bash
php artisan migrate
```

Start the development servers:

```bash
composer run dev
```

Open the app:

```text
http://127.0.0.1:8000
```

If port `8000` is already in use, Laravel may start on another port such as `8001`.

## Useful Commands

Run the PHP test suite:

```bash
php artisan test
```

Run Laravel Pint:

```bash
./vendor/bin/pint
```

Build frontend assets:

```bash
npm run build
```

Run only Vite:

```bash
npm run dev
```

## Public Endpoints

Public command page and CLI installer:

```text
GET /{username}
```

Raw public keys:

```text
GET /{username}.keys
```

Installer script:

```text
GET /{username}/install
```

## Authenticated Dashboard Endpoints

Dashboard:

```text
GET /dashboard
```

Update username:

```text
PATCH /dashboard/username
```

Add SSH key:

```text
POST /dashboard/keys
```

Delete SSH key:

```text
DELETE /dashboard/keys/{key}
```

## Security Notes

- Only public SSH keys should be submitted.
- Private keys must stay on the user's machine.
- The installer uses `ssh-keygen` to validate keys before appending them.
- Duplicate saved keys are detected by hashing the key type and public key body.
- The install command pipes a script into `bash`; users should only run commands from a SSHID instance they trust.

## Repository Description

Memorable SSH public key hosting and one-command server authorization for developers and teams.

## License

This project is open-sourced under the MIT license.


## Development Environment

Built using **ServBay**

<p align="left">
  <img src="https://res.cloudinary.com/djgvfl1tv/image/upload/v1780667063/servbay_edc7jz.png" alt="ServBay" width="120">
</p>

- Mac M4 Tested
- macOS Apple Silicon
- Powered by ServBay

---