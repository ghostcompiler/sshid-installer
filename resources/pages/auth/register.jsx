import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Form, Link } from "@inertiajs/react";
import { Loader } from "lucide-react";

export default function Register() {
    return (
        <Form method="post" action="/auth/register">
            {({ errors, processing }) => (
                <div className="flex flex-col gap-4">
                    <Field>
                        <FieldLabel>Name</FieldLabel>
                        <FieldContent>
                            <Input
                                aria-invalid={errors.name ? "true" : "false"}
                                type="text"
                                name="name"
                                placeholder="John Doe"
                            />
                        </FieldContent>
                        <FieldError>{errors.name}</FieldError>
                    </Field>
                    <Field>
                        <FieldLabel>Username</FieldLabel>
                        <FieldContent>
                            <Input
                                aria-invalid={errors.username ? "true" : "false"}
                                type="text"
                                name="username"
                                placeholder="ghostcompiler"
                            />
                        </FieldContent>
                        <FieldError>{errors.username}</FieldError>
                    </Field>
                    <Field>
                        <FieldLabel>Email</FieldLabel>
                        <FieldContent>
                            <Input
                                aria-invalid={errors.email ? "true" : "false"}
                                type="email"
                                name="email"
                                placeholder="john.doe@example.com"
                            />
                        </FieldContent>
                        <FieldError>{errors.email}</FieldError>
                    </Field>
                    <Field>
                        <FieldLabel>Password</FieldLabel>
                        <FieldContent>
                            <Input
                                aria-invalid={errors.password ? "true" : "false"}
                                type="password"
                                name="password"
                                placeholder="********"
                            />
                        </FieldContent>
                        <FieldError>{errors.password}</FieldError>
                    </Field>
                    <Field>
                        <FieldLabel>Confirm password</FieldLabel>
                        <FieldContent>
                            <Input
                                type="password"
                                name="password_confirmation"
                                placeholder="********"
                            />
                        </FieldContent>
                    </Field>
                    <div className="px-4 py-1">
                        <Button type="submit" disabled={processing} className="w-full">
                            {processing && <Loader className="size-4 animate-spin" />}
                            {processing ? "Please wait..." : "Create account"}
                        </Button>
                    </div>
                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-foreground underline underline-offset-4">
                            Login
                        </Link>
                    </p>
                </div>
            )}
        </Form>
    );
}
