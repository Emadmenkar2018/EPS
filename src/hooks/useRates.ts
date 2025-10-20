import { useQuery } from '@tanstack/react-query';
import { fetchCurrencyList, fetchSevenDayRates } from '../helpers/ratesApi';

export type CurrencyListResponse = Record<string, string>;

export function useCurrencyList() {
    return useQuery<CurrencyListResponse>({
        queryKey: ['currencyList'],
        queryFn: async () => {
            const data = await fetchCurrencyList();
            const uppercased = Object.fromEntries(
                Object.entries(data).map(([key, value]) => [key.toUpperCase(), String(value)])
            ) as Record<string, string>;
            return uppercased;
        },
        staleTime: 24 * 60 * 60 * 1000
    });
}

export interface RateItem {
    date: string;
    rates: Record<string, number>;
}

export type UseRatesResponse = RateItem[];

export function useRates(base: string, endDate: Date) {
    return useQuery<UseRatesResponse>({
        queryKey: ['rates', base, endDate],
        queryFn: async () => {
            const data = await fetchSevenDayRates(base, endDate);
            return data.map((item: any) => ({
                date: item.date,
                rates: Object.fromEntries(
                    Object.entries(item.rates)
                        .filter(([_, v]) => typeof v === 'number')
                        .map(([k, v]) => [k.toUpperCase(), v as number])
                )
            }));
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false
    });
}
