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
        // Try to get preferred locale from cookie or use default
        const preferredLocale = getPreferredLocale(request);

        // Ensure the preferred locale is valid
        const validLocale = locales.includes(preferredLocale as any) ? preferredLocale : defaultLocale;

        return NextResponse.redirect(
            new URL(`/${validLocale}${pathname}`, request.url)
        );
    }

    return NextResponse.next();
}

function getPreferredLocale(request: NextRequest): string {
    // Check for stored locale preference in cookies (we'll set this from localStorage)
    const cookieLocale = request.cookies.get('antimemetics-preferred-locale')?.value;
    if (cookieLocale && locales.includes(cookieLocale as any)) {
        return cookieLocale;
    }

    // Check Accept-Language header as fallback
    const acceptLanguage = request.headers.get('accept-language') || '';
    const browserLocale = acceptLanguage.split(',')[0]?.split('-')[0];
    if (browserLocale && locales.includes(browserLocale as any)) {
        return browserLocale;
    }

    // Fallback to default locale
    return defaultLocale;
}

export const config = {
    // Matcher ignoring `/_next/` and `/api/`
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}; 