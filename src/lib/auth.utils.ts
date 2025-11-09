export type IUserRole = 'ADMIN' | 'DOCTOR' | 'PATIENT';

export type RouteConfig = {
    exact: string[],
    patterns: RegExp[]
}

export const authRoutes = ['/login', '/register', '/forget-password', '/reset-password'];

export const commonProtectedRouter: RouteConfig = {
    exact: ['/my-profile', '/settings'],
    patterns: []
}

export const doctorProtectedRouter: RouteConfig = {
    patterns: [/^\/doctor/],
    exact: []
}

export const adminProtectedRoutes: RouteConfig = {
    patterns: [/^\/admin/],
    exact: []
}

export const patientProtectedRoutes: RouteConfig = {
    patterns: [/^\/dashboard/],
    exact: []
}

export const isAuthRoute = (pathname: string) => {
    return authRoutes.some((route) => route === pathname);
};

export const isRouteMatched = (pathname: string, routes: RouteConfig): boolean => {
    if (routes.exact.includes(pathname)) {
        return true;
    }
    return routes.patterns.some((pattern: RegExp) => pattern.test(pathname));
}

export const getRouteOwner = (pathname: string): 'ADMIN' | 'DOCTOR' | 'PATIENT' | 'COMMON' | null => {
    if (isRouteMatched(pathname, adminProtectedRoutes)) {
        return 'ADMIN'
    }
    if (isRouteMatched(pathname, doctorProtectedRouter)) {
        return 'DOCTOR'
    }
    if (isRouteMatched(pathname, patientProtectedRoutes)) {
        return 'PATIENT'
    }
    if (isRouteMatched(pathname, commonProtectedRouter)) {
        return 'COMMON'
    }
    return null;
};

export const getDefaultDashboardRoute = (role: IUserRole) => {
    if (role === "ADMIN") {
        return "/admin/dashboard";
    }
    if (role === "DOCTOR") {
        return "/doctor/dashboard";
    }
    if (role === "PATIENT") {
        return "/dashboard";
    }
    return '/';
}

export const isValidRedirectForRole = (redirectPath: string, role: IUserRole): boolean => {
    const routeOwner = getRouteOwner(redirectPath);
    if (routeOwner === null || routeOwner === "COMMON") {
        return true;
    }
    if (routeOwner === role) {
        return true;
    }
    return false;
}