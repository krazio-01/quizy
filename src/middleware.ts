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

const PROTECTED_PATH_PREFIXES = ['/profile'];

const AUTH_API_EXCLUSIONS = ['signup', 'forgot-password', 'resendOtp', 'verifyOtp'];
const API_EXCLUSIONS = ['payment/webhook', 'payment/callback'];

export async function middleware(request) {
    const { pathname, searchParams } = request.nextUrl;

    if (pathname.startsWith('/api/auth')) {
        const hasExclusion = AUTH_API_EXCLUSIONS.some((exclusion) => pathname.includes(exclusion));
        if (!hasExclusion) return NextResponse.next();
    }

    if (pathname.startsWith('/api/') && !API_EXCLUSIONS.some((exclusion) => pathname.includes(exclusion))) {
        const apiToken = request.headers.get('x-api-token');
        if (apiToken !== process.env.NEXT_PUBLIC_API_TOKEN) {
            return new NextResponse(JSON.stringify({ error: 'Unauthorized request' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        return NextResponse.next();
    }

    if (pathname.startsWith('/forgot-password/change')) {
        if (!searchParams.get('token')) return NextResponse.redirect(new URL('/', request.url));
    }

    const token = await getToken({ req: request });

    const isPublicPath = PUBLIC_PATHS.has(pathname);
    const isProtectedPath = PROTECTED_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));

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
        '/api/:path*',
    ],
};
