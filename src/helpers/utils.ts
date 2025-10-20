export const fmt = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

export const today = () => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), t.getDate());
};

export const daysAgo = (n: number) => {
    const t = today();
    t.setDate(t.getDate() - n);
    return t;
};

export const lastNDates = (endDate: Date, n: number) => {
    const arr = [];
    for (let i = n - 1; i >= 0; i--) {
        const dt = new Date(endDate);
        dt.setDate(dt.getDate() - i);
        arr.push(fmt(dt));
    }
    return arr;
};
