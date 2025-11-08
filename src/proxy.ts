import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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

const authRoutes = ['/login', '/register', '/forget-password', '/reset-password'];

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
    return NextResponse.redirect(new URL('/home', request.url))
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: '/about/:path*',
}