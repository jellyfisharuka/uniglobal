import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('uni_auth_token')?.value;
    const url = request.nextUrl.clone();
    const { pathname } = url;

    const publicPaths = ['/', '/login', '/register'];
    const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(`${path}/`));

    if (!token && !isPublicPath) {
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|static|.*\\..*|_next).*)",
    ]
}