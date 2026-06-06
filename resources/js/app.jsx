import { createInertiaApp } from '@inertiajs/react'
import AuthLayout from '../layouts/auth-layout';
import { TooltipProvider } from '../components/ui/tooltip';
import "../css/app.css";
import DashboardLayout from '@/layouts/dashboard-layout';
import { Toaster } from '@/components/ui/sonner';

createInertiaApp({
    layout: (name) => {
        const page = name.toLowerCase();
        if(page.includes('auth')) {
            return AuthLayout;
        }
        if(page.includes('dashboard')) {
            return DashboardLayout;
        }
        return null;
    },
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        )
    },
    pages: {
        path: '../pages',
        extension: '.jsx',
        lazy: true,
    },
    progress: {
        delay: 0,
    }
});