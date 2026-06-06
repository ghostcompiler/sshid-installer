import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { Home, LogOut } from "lucide-react";

export default function DashboardLayout({ children }) {
    return (
        <div className="min-h-svh w-svw">
            <header className="bg-sidebar border-b h-14">
                <div className="max-w-5xl mx-auto px-4 h-full">
                    <div className="flex items-center justify-between h-full">
                        <div className="flex items-center gap-2">
                            <Link href="/dashboard" className="flex items-center gap-2">
                                <img
                                    src="/images/ghostcompiler-logo.png"
                                    alt="GhostCompiler"
                                    className="size-12 rounded-md"
                                />
                                <span className="hidden text-sm font-semibold sm:inline">SSHID</span>
                            </Link>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button size="xs" variant="destructive" asChild>
                                <Link method="post" href="/auth/logout">
                                    <LogOut />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>
            <main className="flex-1 max-w-5xl mx-auto px-4 py-4">
                {children}
            </main>
        </div>
    );
}
