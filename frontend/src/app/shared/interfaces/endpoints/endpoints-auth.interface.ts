export interface EndpointsAuth {
    login: string;
    logout: string;
    validate: string;
}

export const ENDPOINTS: EndpointsAuth = {
    login: 'auth/login',
    logout: 'auth/logout',
    validate: 'auth/validate',
};