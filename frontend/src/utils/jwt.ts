export interface JWTPayload {
    sub: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
}

export const decodeJWT = (token: string): JWTPayload | null => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Failed to decode JWT:', error);
        return null;
    }
};

export const isTokenExpired = (token: string): boolean => {
    const payload = decodeJWT(token);
    if (!payload) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
};

export const getTokenExpirationTime = (token: string): number | null => {
    const payload = decodeJWT(token);
    return payload ? payload.exp * 1000 : null; // Convert to milliseconds
};

export const getTimeUntilExpiration = (token: string): number | null => {
    const expirationTime = getTokenExpirationTime(token);
    if (!expirationTime) return null;

    const currentTime = Date.now();
    return Math.max(0, expirationTime - currentTime);
}; 