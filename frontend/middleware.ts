import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './src/i18n';

export function middleware(request: NextRequest) {
    // Check if there is any supported locale in the pathname
    const pathname = request.nextUrl.pathname;

    // Check if the pathname is missing a locale
    const pathnameIsMissingLocale = locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
        return NextResponse.redirect(
            new URL(`/${defaultLocale}${pathname}`, request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    // Matcher ignoring `/_next/` and `/api/`
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}; 