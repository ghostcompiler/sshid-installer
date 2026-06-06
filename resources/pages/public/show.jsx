import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Copy, KeyRound, Terminal, UserRound } from "lucide-react";
import { useState } from "react";

export default function PublicKeyPage({ profile, installCommand, rawCommand, publicUrl, rawKeysUrl }) {
    const [copied, setCopied] = useState(null);

    const copy = async (value, label) => {
        await navigator.clipboard.writeText(value);
        setCopied(label);
        window.setTimeout(() => setCopied(null), 1600);
    };

    return (
        <main className="min-h-svh bg-[#08090b] text-white">
            <section className="mx-auto flex min-h-svh w-full max-w-4xl flex-col justify-center gap-8 px-5 py-10">
                <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-lg bg-white text-black">
                            <KeyRound className="size-5" />
                        </div>
                        <div>
                            <p className="text-sm text-white/55">SSHID</p>
                            <h1 className="text-3xl font-semibold tracking-normal md:text-5xl">@{profile.username}</h1>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Badge className="border-white/10 bg-white/10 text-white hover:bg-white/10">
                            <UserRound className="size-3" />
                            {profile.name}
                        </Badge>
                        <Badge className="border-emerald-400/20 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/10">
                            {profile.keyCount} {profile.keyCount === 1 ? "public key" : "public keys"}
                        </Badge>
                    </div>
                    <p className="max-w-2xl text-base leading-7 text-white/65">
                        Install this user&apos;s trusted SSH public keys on a server. The installer validates keys, creates the SSH directory, fixes permissions, and skips keys that already exist.
                    </p>
                </div>

                <div className="grid gap-4">
                    <CommandPanel
                        title="Recommended"
                        description="Safe to run repeatedly on a server."
                        command={installCommand}
                        copied={copied === "install"}
                        onCopy={() => copy(installCommand, "install")}
                    />
                    <CommandPanel
                        title="Raw authorized_keys append"
                        description="For simple one-line installs."
                        command={rawCommand}
                        copied={copied === "raw"}
                        onCopy={() => copy(rawCommand, "raw")}
                        muted
                    />
                </div>

                <div className="flex flex-col gap-2 border-t border-white/10 pt-5 text-sm text-white/45 md:flex-row md:items-center md:justify-between">
                    <span>Raw key endpoint</span>
                    <a href={rawKeysUrl} className="truncate font-mono text-white/70 underline underline-offset-4">
                        {rawKeysUrl}
                    </a>
                </div>
            </section>
        </main>
    );
}

function CommandPanel({ title, description, command, copied, onCopy, muted = false }) {
    return (
        <div className={`rounded-lg border p-4 ${muted ? "border-white/10 bg-white/[0.03]" : "border-white/15 bg-white/[0.07]"}`}>
            <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-sm font-medium">{title}</h2>
                    <p className="text-sm text-white/50">{description}</p>
                </div>
                <Terminal className="size-5 text-white/40" />
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg border border-white/10 bg-black/45 p-2">
                <code className="truncate px-1 font-mono text-sm text-emerald-200">{command}</code>
                <Button type="button" variant="secondary" size="sm" onClick={onCopy}>
                    {copied ? <Check className="text-emerald-500" /> : <Copy />}
                    {copied ? "Copied" : "Copy"}
                </Button>
            </div>
        </div>
    );
}
