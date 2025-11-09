import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from 'next/headers';
type IUserRole = 'ADMIN' | 'DOCTOR' | 'PATIENT';

type RouteConfig = {
    exact: string[],
    patterns: RegExp[]
}

const commonProtectedRouter: RouteConfig = {
    exact: ['/my-profile', '/settings'],
    patterns: []
}

const doctorProtectedRouter: RouteConfig = {
    patterns: [/^\/doctor/],
    exact: []
}

const adminProtectedRoutes: RouteConfig = {
    patterns: [/^\/admin/],
    exact: []
}

const patientProtectedRoutes: RouteConfig = {
    patterns: [/^\/dashboard/],
    exact: []
}

const isAuthRoute = (pathname: string) => {
    return authRoutes.some((route) => {
        return route === pathname;
    });
};

const isRouteMatched = (pathname: string, routes: RouteConfig): boolean => {
    if (routes.exact.includes(pathname)) {
        return true;
    }
    return routes.patterns.some((pattern: RegExp) => pattern.test(pathname));
}

const authRoutes = ['/login', '/register', '/forget-password', '/reset-password'];


const getRouteOwner = (pathname: string): 'ADMIN' | 'DOCTOR' | 'PATIENT' | 'COMMON' | null => {
    if (isRouteMatched(pathname, adminProtectedRoutes)) {
        return 'ADMIN'
    }
    if (isRouteMatched(pathname, patientProtectedRoutes)) {
        return 'PATIENT'
    }
    if (isRouteMatched(pathname, doctorProtectedRouter)) {
        return 'DOCTOR'
    }
    if (isRouteMatched(pathname, commonProtectedRouter)) {
        return 'COMMON'
    }
    return null;
};

const getDefaultDashboardRoute = (role: IUserRole) => {
    if (role === "ADMIN") {
        return "/admin/dashboard";
    }
    if (role === "DOCTOR") {
        return "/doctor/dashboard";
    }
    if (role === "PATIENT") {
        return "/patient/dashboard";
    }
    return '/';
}


// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {

    const pathname = request.nextUrl.pathname;
    const cookieStore = await cookies();
    const accessToken = request.cookies.get("accessToken")?.value || null;
    let userRole: IUserRole | null = null;
    if (accessToken) {
        const verifiedToken: JwtPayload | string = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET as string);
        if (typeof verifiedToken === "string") {
            cookieStore.delete("accessToken");
            cookieStore.delete("refreshToken");
            return NextResponse.redirect(new URL('/login', request.url))
        }
        userRole = verifiedToken.role;
    }

    const routeOwner = getRouteOwner(pathname);

    const isAuth = isAuthRoute(pathname);

    if (accessToken && isAuth) {
        return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as IUserRole), request.url));

    }
    if (routeOwner === null) {
        return NextResponse.next()
    }
    if (!accessToken) {
        return NextResponse.next()
    }
    if (routeOwner === 'COMMON') {
        return NextResponse.next()
    }
    if (routeOwner === "ADMIN" || routeOwner === "DOCTOR" || routeOwner === "PATIENT") {
        if (userRole !== routeOwner) {
            return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as IUserRole), request.url))
        }
    }


    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)',
    ],
}