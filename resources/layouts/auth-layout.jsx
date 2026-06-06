import { usePage } from "@inertiajs/react";

export default function AuthLayout({ children }) {
    const { component } = usePage();
    const isRegister = component === "auth/register";

    return (
        <div className="flex flex-col items-center justify-center p-4 h-svh w-svw space-y-4">
            <div className="flex flex-col items-center justify-center space-y-3">
                <img
                    src="/images/ghostcompiler-logo.png"
                    alt="GhostCompiler"
                    className="size-16 rounded-lg"
                />
                <div className="flex flex-col items-center justify-center space-y-1">
                    <h1 className="text-2xl font-bold leading-none">
                        {isRegister ? "Create Account" : "Welcome Back!"}
                    </h1>
                    <p className="text-sm text-muted-foreground leading-none">
                        {isRegister ? "Choose your SSHID username and credentials" : "Please provide your credentials to continue"}
                    </p>
                </div>
            </div>
            <div className="w-full max-w-sm">
                {children}
            </div>
        </div>
    );
}
