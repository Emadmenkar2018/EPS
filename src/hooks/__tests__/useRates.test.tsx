import { useCurrencyList, useRates } from '../useRates';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fetchCurrencyList, fetchSevenDayRates } from '../../helpers/ratesApi';

vi.mock('../../helpers/ratesApi', () => ({
    fetchSevenDayRates: vi.fn().mockResolvedValue([
        {
            date: '2024-06-01',
            rates: { usd: 1, eur: 0.9, gbp: 'invalid' }
        },
        {
            date: '2024-06-02',
            rates: { usd: 1.01, eur: 0.91 }
        }
    ]),
    fetchCurrencyList: vi.fn().mockResolvedValue({
        USD: 'Dollar',
        EUR: 'Euro',
        GBP: '123',
    })
}));

const createWrapper = () => {
    const qc = new QueryClient({
        defaultOptions: { queries: { retry: false, gcTime: Infinity } },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    );
};

describe('useCurrencyList', () => {
    it('should be defined', () => {
        const { result } = renderHook(() => useCurrencyList(), { wrapper: createWrapper() });
        expect(result.current).toBeDefined();
    });

    it('should return initial rates state', () => {
        const { result } = renderHook(() => useCurrencyList(), { wrapper: createWrapper() });
        expect(result.current.data).toBeUndefined();
        expect(result.current.isLoading).toBe(true);
    });

    it('fetches and formats currency list correctly', async () => {
        const mockCurrencyList = { usd: 'Dollar', eur: 'Euro', gbp: '123' };
        vi.doMock('../../helpers/ratesApi', () => ({
            ...vi.importActual('../../helpers/ratesApi'),
            fetchCurrencyList: vi.fn().mockResolvedValue(mockCurrencyList),
        }));
        const { useCurrencyList } = await import('../useRates');

        const { result } = renderHook(() => useCurrencyList(), { wrapper: createWrapper() });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toEqual({
            USD: 'Dollar',
            EUR: 'Euro',
            GBP: '123',
        });
        expect(result.current.isLoading).toBe(false);
    });

    it('should handle error state', async () => {
        const error = new Error('Currency list fetch failed');
        vi.mocked(fetchCurrencyList).mockRejectedValueOnce(error);

        const { useCurrencyList } = await import('../useRates');

        const { result } = renderHook(() => useCurrencyList(), { wrapper: createWrapper() });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
            expect(result.current.error).toBeTruthy();
        });

        expect((result.current.error as Error).message).toBe('Currency list fetch failed');
        expect(result.current.isLoading).toBe(false);
    });

});


describe('useRates', () => {
    it('should be defined', () => {
        const { result } = renderHook(() => useRates('USD', new Date('2024-06-01')), { wrapper: createWrapper() });
        expect(result.current).toBeDefined();
    });

    it('should return initial rates state', () => {
        const { result } = renderHook(() => useRates('USD', new Date('2024-06-01')), { wrapper: createWrapper() });
        expect(result.current.data).toBeUndefined();
        expect(result.current.isLoading).toBe(true);
    });

    it('fetches & formats rates correctly', async () => {
        const { result } = renderHook(
            () => useRates('USD', new Date('2024-06-01')),
            { wrapper: createWrapper() }
        );

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toEqual([
            { date: '2024-06-01', rates: { USD: 1, EUR: 0.9 } },
            { date: '2024-06-02', rates: { USD: 1.01, EUR: 0.91 } },
        ]);

        expect(result.current.isLoading).toBe(false);
    });

    it('filters out invalid rates', async () => {
        const { result } = renderHook(
            () => useRates('USD', new Date('2024-06-01')),
            { wrapper: createWrapper() }
        );

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data?.[0].rates).not.toHaveProperty('GBP');
        expect(result.current.data?.[0].rates).toEqual({ USD: 1, EUR: 0.9 });
    });

    it('should refetch when base or endDate changes', async () => {
        const { result, rerender } = renderHook(
            ({ base, endDate }) => useRates(base, endDate),
            { initialProps: { base: 'USD', endDate: new Date('2024-06-01') }, wrapper: createWrapper() }
        );
        await waitFor(() => result.current.isSuccess);
        rerender({ base: 'EUR', endDate: new Date('2024-06-02') });
        await waitFor(() => result.current.isSuccess);
        expect(fetchSevenDayRates).toHaveBeenCalledWith('EUR', new Date('2024-06-02'));
    });

    it('should handle error state', async () => {
        const error = new Error('Failed to fetch');
        vi.mocked(fetchSevenDayRates).mockRejectedValueOnce(error);

        const { result } = renderHook(() => useRates('USD', new Date('2024-06-01')), { wrapper: createWrapper() });
        await waitFor(() => {
            expect(result.current.isError).toBe(true);
            expect(result.current.error).toBeTruthy();
        });

        expect((result.current.error as Error).message).toBe('Failed to fetch');
        expect(result.current.isLoading).toBe(false);
    });
});