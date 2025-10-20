import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { fmt, today, daysAgo, lastNDates } from '../utils';

describe('date helpers', () => {
    const realNow = new Date('2025-03-01T15:42:18'); // arbitrary fixed "now"

    beforeAll(() => {
        vi.useFakeTimers();
        vi.setSystemTime(realNow);
    });

    afterAll(() => {
        vi.useRealTimers();
    });

    it('fmt formats YYYY-MM-DD with zero padding', () => {
        expect(fmt(new Date(2024, 2, 7))).toBe('2024-03-07');  // Mar is 2 (0-indexed)
        expect(fmt(new Date(2024, 10, 13))).toBe('2024-11-13');
    });

    it('today returns local midnight of the current day', () => {
        const t = today();
        expect(t.getFullYear()).toBe(2025);
        expect(t.getMonth()).toBe(2);   // March
        expect(t.getDate()).toBe(1);
        expect(t.getHours()).toBe(0);
        expect(t.getMinutes()).toBe(0);
        expect(t.getSeconds()).toBe(0);
        expect(t.getMilliseconds()).toBe(0);
    });

    it('daysAgo subtracts whole days from today (cross-month safe)', () => {
        // realNow is 2025-03-01, so 3 days ago -> 2025-02-26
        const d = daysAgo(3);
        expect(d.getFullYear()).toBe(2025);
        expect(d.getMonth()).toBe(1); // Feb
        expect(d.getDate()).toBe(26);
        // still midnight
        expect(d.getHours()).toBe(0);
    });

    it('lastNDates returns ascending list ending at endDate, formatted', () => {
        const end = new Date(2024, 1, 29); // 2024-02-29 (leap year)
        const list = lastNDates(end, 3);
        expect(list).toEqual(['2024-02-27', '2024-02-28', '2024-02-29']);
    });

    it('lastNDates does not mutate the input date', () => {
        const end = new Date(2024, 6, 10); // 2024-07-10
        const originalTime = end.getTime();
        const res = lastNDates(end, 1);
        expect(res).toEqual(['2024-07-10']);
        expect(end.getTime()).toBe(originalTime);
    });
});