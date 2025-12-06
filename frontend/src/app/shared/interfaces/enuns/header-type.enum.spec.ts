import { HeaderType } from './header-type.enum';

describe('HeaderType enum', () => {

    it('should be defined', () => {
        expect(HeaderType).toBeTruthy();
    });

    it('should contain all expected keys', () => {
        const expectedKeys = [
            'CORS',
            'ACCEPT_JSON',
            'CONTENT_JSON',
            'CONTENT_MULTIPART',
            'AUTH',
            'ALLOW_ALL_METHODS',
            'ALLOW_COMMON_METHODS',
            'AUTHORIZATION',
        ];

        expectedKeys.forEach(key => {
            expect(HeaderType[key as keyof typeof HeaderType]).toBeDefined();
        });
    });

    it('should contain correct enum values', () => {
        expect(HeaderType.CORS).toBe('CORS');
        expect(HeaderType.ACCEPT_JSON).toBe('ACCEPT_JSON');
        expect(HeaderType.CONTENT_JSON).toBe('CONTENT_JSON');
        expect(HeaderType.CONTENT_MULTIPART).toBe('CONTENT_MULTIPART');
        expect(HeaderType.AUTH).toBe('AUTH');
        expect(HeaderType.ALLOW_ALL_METHODS).toBe('ALLOW_ALL_METHODS');
        expect(HeaderType.ALLOW_COMMON_METHODS).toBe('ALLOW_COMMON_METHODS');
        expect(HeaderType.AUTHORIZATION).toBe('AUTHORIZATION');
    });

    it('should not contain extra keys', () => {
        const enumKeys = Object.keys(HeaderType);
        const expectedKeys = [
            'CORS',
            'ACCEPT_JSON',
            'CONTENT_JSON',
            'CONTENT_MULTIPART',
            'AUTH',
            'ALLOW_ALL_METHODS',
            'ALLOW_COMMON_METHODS',
            'AUTHORIZATION',
        ];

        expect(enumKeys.sort()).toEqual(expectedKeys.sort());
    });

});
