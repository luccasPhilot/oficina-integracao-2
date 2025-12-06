import { ENDPOINTS, EndpointsAuth } from "./endpoints-auth.interface";

describe('ENDPOINTS constant', () => {

    it('should be defined', () => {
        expect(ENDPOINTS).toBeTruthy();
    });

    it('should match the EndpointsAuth interface structure', () => {
        const keys: (keyof EndpointsAuth)[] = ['login', 'logout', 'validate'];

        keys.forEach(key => {
            expect(ENDPOINTS[key]).toBeDefined();
            expect(typeof ENDPOINTS[key]).toBe('string');
        });
    });

    it('should contain correct endpoint values', () => {
        expect(ENDPOINTS.login).toBe('auth/login');
        expect(ENDPOINTS.logout).toBe('auth/logout');
        expect(ENDPOINTS.validate).toBe('auth/validate');
    });

});
