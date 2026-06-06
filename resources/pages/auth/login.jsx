import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Form, Link } from "@inertiajs/react";
import { Loader } from "lucide-react";

export default function Login() {
    return (
        <Form method="post">
            {({ errors, processing }) => (
                <div className="flex flex-col gap-4">
                    <Field>
                        <FieldLabel>
                            Email
                        </FieldLabel>
                        <FieldContent>
                            <Input
                                aria-invalid={errors.email ? 'true' : 'false'}
                                type="email"
                                name="email"
                                placeholder="John.doe@example.com"
                                defaultValue="ghostcompiler.s@gmail.com"
                            />
                        </FieldContent>
                        <FieldError>
                            {errors.email}
                        </FieldError>
                    </Field>
                    <Field>
                        <FieldLabel>
                            Password
                        </FieldLabel>
                        <FieldContent>
                            <Input
                                aria-invalid={errors.password ? 'true' : 'false'}
                                type="password"
                                name="password"
                                placeholder="********"
                                defaultValue="password"
                            />
                        </FieldContent>
                        <FieldError>
                            {errors.password}
                        </FieldError>
                    </Field>
                    <div className="px-4 py-1">
                        <Button type="submit" disabled={processing} className="w-full">
                            {processing && <Loader className="size-4 animate-spin" />}
                            {processing ? 'Please wait...' : 'Login'}
                        </Button>
                    </div>
                    <p className="text-center text-sm text-muted-foreground">
                        New here?{" "}
                        <Link href="/auth/register" className="text-foreground underline underline-offset-4">
                            Create an account
                        </Link>
                    </p>
                </div>
            )}
        </Form>
    );
}
