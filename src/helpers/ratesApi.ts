import { lastNDates } from "./utils";


export const fetchCurrencyList = async () => {
    const url = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json';
    const r = await fetch(url);
    if (!r.ok) throw new Error('Failed to load currency list');
    return r.json();
}

export const fetchSevenDayRates = async (base: string, endDate: Date) => {
    const dates = lastNDates(endDate, 7);
    // Considering that the API only support values by each day, thus we fetch each day's data separately
    const urls = dates.map((d: string) => `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${d}/v1/currencies/${base}.json`);
    const res = await Promise.all(urls.map((u: string) => fetch(u)));
    const bad = res.find((r: Response) => !r.ok);
    if (bad) throw new Error('Failed to load one or more rate files');
    const json = await Promise.all(res.map((r: Response) => r.json()));
    return json.map((j: any) => ({ date: j.date, rates: j[base] })).sort((a: any, b: any) => a.date.localeCompare(b.date));
}