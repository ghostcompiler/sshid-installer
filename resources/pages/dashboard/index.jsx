import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";
import { Form, router } from "@inertiajs/react";
import { CheckCircle2, Copy, ExternalLink, KeyRound, Loader, Terminal, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function Index({ user, keys = [], publicUrl, rawKeysUrl }) {
    const [copied, setCopied] = useState(null);

    const installCommand = useMemo(() => {
        return `curl -sS ${publicUrl} | bash`;
    }, [publicUrl]);

    const publicCommand = useMemo(() => {
        return `curl -sS ${rawKeysUrl} >> ~/.ssh/authorized_keys`;
    }, [rawKeysUrl]);

    const copy = async (value, label) => {
        await navigator.clipboard.writeText(value);
        setCopied(label);
        window.setTimeout(() => setCopied(null), 1600);
    };

    return (
        <div className="mx-auto flex max-w-5xl flex-col gap-5">
            <Card className="rounded-lg">
                <CardHeader>
                    <CardTitle>Public username</CardTitle>
                    <CardDescription>
                        This controls your public install page and command URL.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form method="patch" action="/dashboard/username" onSuccess={() => toast.success('Username updated')}>
                        {({ errors, processing }) => (
                            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                                <Field>
                                    <FieldLabel>Username</FieldLabel>
                                    <FieldContent>
                                        <InputGroup>
                                            <InputGroupAddon>@</InputGroupAddon>
                                            <InputGroupInput
                                                aria-invalid={errors.username ? "true" : "false"}
                                                name="username"
                                                defaultValue={user.username}
                                            />
                                        </InputGroup>
                                    </FieldContent>
                                    <FieldError>{errors.username}</FieldError>
                                </Field>
                                <div className="flex items-center gap-3">
                                    <Button type="submit" disabled={processing}>
                                        {processing && <Loader className="size-4 animate-spin" />}
                                        {processing ? 'Saving...' : 'Save username'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Form>
                </CardContent>
            </Card>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
                <Card className="rounded-lg">
                    <CardHeader>
                        <CardTitle>Add public key</CardTitle>
                        <CardDescription>
                            Paste one OpenSSH public key, such as an ed25519 or rsa key.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form method="post" action="/dashboard/keys" resetOnSuccess={["key"]}>
                            {({ errors, processing, wasSuccessful }) => (
                                <div className="flex flex-col gap-3">
                                    <Field>
                                        <FieldLabel>Public key</FieldLabel>
                                        <FieldContent>
                                            <Textarea
                                                aria-invalid={errors.key ? "true" : "false"}
                                                name="key"
                                                placeholder="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... you@example.com"
                                                className="min-h-28 resize-y font-mono text-xs leading-5"
                                            />
                                        </FieldContent>
                                        <FieldError>{errors.key}</FieldError>
                                    </Field>
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="min-h-5 text-xs text-muted-foreground">
                                            {wasSuccessful && (
                                                <span className="inline-flex items-center gap-1 text-emerald-500">
                                                    <CheckCircle2 className="size-3.5" />
                                                    Key saved
                                                </span>
                                            )}
                                        </div>
                                        <Button type="submit" disabled={processing}>
                                            {processing && <Loader className="size-4 animate-spin" />}
                                            Save key
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Form>
                    </CardContent>
                </Card>

                <Card className="rounded-lg">
                    <CardHeader>
                        <CardTitle>Install command</CardTitle>
                        <CardDescription>
                            This script creates the SSH directory, validates keys, and skips duplicates.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        <CommandBlock
                            icon={Terminal}
                            command={installCommand}
                            copied={copied === "install"}
                            onCopy={() => copy(installCommand, "install")}
                        />
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <ExternalLink className="size-3.5" />
                            <a href={publicUrl} target="_blank" className="truncate underline underline-offset-4">
                                {publicUrl}
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="rounded-lg">
                <CardHeader>
                    <CardTitle>Saved keys</CardTitle>
                    <CardDescription>
                        {keys.length} {keys.length === 1 ? "key" : "keys"} available from your public endpoint.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {keys.length === 0 ? (
                        <Alert>
                            <KeyRound className="size-4" />
                            <AlertTitle>No keys yet</AlertTitle>
                            <AlertDescription>
                                Add a public key above before running the install command on a server.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <div className="divide-y rounded-lg border">
                            {keys.map((key) => (
                                <div key={key.id} className="flex flex-col gap-3 p-3 md:flex-row md:items-center md:justify-between">
                                    <div className="min-w-0 space-y-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge variant="secondary">{key.label}</Badge>
                                            <span className="font-mono text-xs text-muted-foreground">{key.fingerprint}</span>
                                        </div>
                                        <p className="truncate font-mono text-xs text-muted-foreground">{key.key}</p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon-sm"
                                        title="Delete key"
                                        onClick={() => router.delete(`/dashboard/keys/${key.id}`)}
                                    >
                                        <Trash2 />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="rounded-lg">
                <CardHeader>
                    <CardTitle>Raw append command</CardTitle>
                    <CardDescription>
                        Available for simple setups. The installer above is safer for repeated runs.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CommandBlock
                        icon={KeyRound}
                        command={publicCommand}
                        copied={copied === "public"}
                        onCopy={() => copy(publicCommand, "public")}
                    />
                </CardContent>
            </Card>
        </div>
    );
}

function CommandBlock({ icon: Icon, command, copied, onCopy }) {
    return (
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-lg border bg-muted/40 p-2">
            <Icon className="size-4 text-muted-foreground" />
            <code className="truncate font-mono text-xs">{command}</code>
            <Button type="button" variant="outline" size="icon-sm" onClick={onCopy} title="Copy command">
                {copied ? <CheckCircle2 className="text-emerald-500" /> : <Copy />}
            </Button>
        </div>
    );
}
