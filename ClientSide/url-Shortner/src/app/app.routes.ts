import { Routes, CanActivateFn, Router } from '@angular/router';
import { Full } from './layout/full/full';
import { authGuard } from './global/auth-guard';
import { guestGuard } from './global/guest-guard';

export const routes: Routes = [
    // initial redirect to login; guestGuard on /login will forward authenticated users to /dashboard
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    // Application shell (protected children where needed)
    {
        path: '',
        component: Full,
        children: [
            {
                path: 'dashboard',
                data: { breadcrumb: 'Dashboard' },
                canActivate: [authGuard],
                loadComponent: () => import('../app/container/dashboard/dashboard').then(m => m.Dashboard)
            },
            {
                path: 'shorten-url',
                data: { breadcrumb: 'Shorten URL' },
                canActivate: [authGuard],
                loadComponent: () => import('../app/container/short-url/short-url').then(m => m.ShortUrl)
            }
        ]
    },

    // auth routes (only for guests)
    {
        path: 'login',
        canActivate: [guestGuard],
        data: { breadcrumb: 'Login' },
        loadComponent: () => import('../app/auth/login/login').then(m => m.Login)
    },
    {
        path: 'register',
        canActivate: [guestGuard],
        data: { breadcrumb: 'Register' },
        loadComponent: () => import('../app/auth/register/register').then(m => m.Register)
    },

    // fallback
    { path: '**', redirectTo: '' }
];
