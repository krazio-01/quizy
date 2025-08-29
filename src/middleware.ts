import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PUBLIC_PATHS = new Set([
    '/',
    '/login',
    '/register',
    '/verifyEmail',
    '/forgot-password',
    '/forgot-password/request',
]);

const PROTECTED_PATHS = new Set(['/profile']);

export async function middleware(request) {
    const token = await getToken({ req: request });
    const { pathname, searchParams } = request.nextUrl;
    const tokenParams = searchParams.get('token');

    const isPublicPath = PUBLIC_PATHS.has(pathname);
    const isProtectedPath = [...PROTECTED_PATHS].some((protectedPath) => pathname.startsWith(protectedPath));

    if (pathname.startsWith('/forgot-password/change') && !tokenParams)
        return NextResponse.redirect(new URL('/', request.url));

    if (!token && isProtectedPath) return NextResponse.redirect(new URL('/login', request.url));

    if (token && (pathname === '/login' || pathname === '/register'))
        return NextResponse.redirect(new URL('/', request.url));

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/register',
        '/verifyEmail',
        '/forgot-password/request',
        '/forgot-password/change',
        '/profile',
    ],
};
