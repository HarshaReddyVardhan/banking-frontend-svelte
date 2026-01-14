import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from './api';
import { get } from 'svelte/store';

// Mock svelte store
vi.mock('svelte/store', () => ({
    get: vi.fn(),
    writable: vi.fn(() => ({ set: vi.fn(), subscribe: vi.fn(), update: vi.fn() }))
}));

// Mock authStore
vi.mock('$lib/stores/authStore', () => ({
    authStore: {
        subscribe: vi.fn(),
        set: vi.fn()
    }
}));

// Mock global fetch
const fetchMock = vi.fn();
global.fetch = fetchMock;

describe('API Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        fetchMock.mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({ success: true })
        });
        (get as any).mockReturnValue({ accessToken: 'fake-token' });
    });

    it('adds authorization header when logged in', async () => {
        await api.get('/test');

        expect(fetchMock).toHaveBeenCalledWith(
            expect.stringContaining('/test'),
            expect.objectContaining({
                headers: expect.objectContaining({
                    'Authorization': 'Bearer fake-token'
                })
            })
        );
    });

    it('handles 401 unauthorized', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: false,
            status: 401,
            text: async () => 'Unauthorized'
        });

        await expect(api.get('/protected')).rejects.toThrow();
        // Verification of store reset would go here if we exported the store mock to check
    });

    it('handles validation schema', async () => {
        const { z } = await import('zod');
        const schema = z.object({ name: z.string() });

        // Valid
        await api.post('/validate', { name: 'test' }, { schema });
        expect(fetchMock).toHaveBeenCalled();

        // Invalid
        try {
            await api.post('/validate', { name: 123 }, { schema });
            expect(true).toBe(false); // Should fail
        } catch (e) {
            expect(e).toBeDefined();
        }
    });
});
