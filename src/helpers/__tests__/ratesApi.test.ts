import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { fetchCurrencyList, fetchSevenDayRates } from '../ratesApi';

vi.mock('../utils', () => ({
    lastNDates: vi.fn(),
}));
import { lastNDates } from '../utils';

type FetchResp = { ok: boolean; json: () => Promise<any> };

beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('fetchCurrencyList', () => {
    it('returns JSON when response is ok', async () => {
        const mockData = { usd: 'Dollar', eur: 'Euro' };
        (fetch as unknown as Mock).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockData),
        } satisfies FetchResp);

        const data = await fetchCurrencyList();

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(
            'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json'
        );
        expect(data).toEqual(mockData);
    });

    it('throws when response is not ok', async () => {
        (fetch as unknown as Mock).mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({}),
        } satisfies FetchResp);

        await expect(fetchCurrencyList()).rejects.toThrow('Failed to load currency list');
    });
});

describe('fetchSevenDayRates', () => {
    it('fetches per-day URLs, returns sorted list with rates', async () => {
        vi.mocked(lastNDates).mockReturnValue(['2024-06-01', '2024-06-02']);

        (fetch as unknown as Mock)
            .mockResolvedValueOnce({
                ok: true,
                json: () =>
                    Promise.resolve({
                        date: '2024-06-02',
                        usd: { eur: 0.91, brl: 5.2 },
                    }),
            } satisfies FetchResp)
            .mockResolvedValueOnce({
                ok: true,
                json: () =>
                    Promise.resolve({
                        date: '2024-06-01',
                        usd: { eur: 0.9, brl: 5.1 },
                    }),
            } satisfies FetchResp);

        const result = await fetchSevenDayRates('usd', new Date('2024-06-02'));

        expect(fetch).toHaveBeenCalledTimes(2);
        expect(fetch).toHaveBeenNthCalledWith(
            1,
            'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2024-06-01/v1/currencies/usd.json'
        );
        expect(fetch).toHaveBeenNthCalledWith(
            2,
            'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2024-06-02/v1/currencies/usd.json'
        );

        expect(result).toEqual([
            { date: '2024-06-01', rates: { eur: 0.9, brl: 5.1 } },
            { date: '2024-06-02', rates: { eur: 0.91, brl: 5.2 } },
        ]);
    });

    it('throws if any daily fetch is not ok', async () => {
        vi.mocked(lastNDates).mockReturnValue(['2024-06-01', '2024-06-02']);

        (fetch as unknown as Mock)
            .mockResolvedValueOnce({ ok: true, json: async () => ({ date: '2024-06-01', usd: {} }) } as FetchResp)
            .mockResolvedValueOnce({ ok: false, json: async () => ({}) } as FetchResp);

        await expect(fetchSevenDayRates('usd', new Date('2024-06-02')))
            .rejects.toThrow('Failed to load one or more rate files');
    });
});