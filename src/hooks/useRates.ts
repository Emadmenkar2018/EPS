import { useQuery } from '@tanstack/react-query';
import { lastNDates } from '../helpers/utils';

export const fetchCurrencyList = async () => {
    const url = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json';
    const r = await fetch(url);
    if (!r.ok) throw new Error('Failed to load currency list');
    return r.json();
}

export const fetchSevenDayRates = async (base: string, endDate: string) => {
    const dates = lastNDates(endDate, 7);
    const urls = dates.map((d: string) => `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${d}/v1/currencies/${base}.json`);
    const res = await Promise.all(urls.map((u: string) => fetch(u)));
    const bad = res.find((r: Response) => !r.ok);
    if (bad) throw new Error('Failed to load one or more rate files');
    const json = await Promise.all(res.map((r: Response) => r.json()));
    return json.map((j: any) => ({ date: j.date, rates: j[base] })).sort((a: any, b: any) => a.date.localeCompare(b.date)); // change the any
}

export function useCurrencyList() {
    return useQuery({
        queryKey: ['currencyList'],
        queryFn: fetchCurrencyList,
        staleTime: 24 * 60 * 60 * 1000
    });
}

export function useRates(base: string, endDate: Date | string) {
    return useQuery({
        queryKey: ['rates', base, endDate],
        queryFn: () => fetchSevenDayRates(base, endDate.toString()),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false
    });
}
