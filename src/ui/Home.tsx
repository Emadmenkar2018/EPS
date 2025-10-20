import { useCallback, useMemo, useState } from "react";
import { daysAgo, today } from "../helpers/utils";
import { useCurrencyList, useRates } from "../hooks/useRates";
import { Table } from "../components/Table";
import { MultiSelect } from "../components/MultiSelect";
import { DropdownSelect } from "../components/DropdownSelect";
import { DatePicker } from '@progress/kendo-react-dateinputs';

const DAYS_AGO = 90;
const MIN_COUNTER_CURRENCIES = 3;
const MAX_COUNTER_CURRENCIES = 7;
const DATA_SOURCE_ATTRIBUTION = "Data source: @fawazahmed0/currency-api via jsDelivr. Values show how much of the counter currency equals 1";

function Home() {
    const [base, setBase] = useState('GBP');
    const [selected, setSelected] = useState(['USD', 'EUR', 'JPY', 'CHF', 'CAD', 'AUD', 'ZAR']);
    const [endDate, setEndDate] = useState(today());

    const { data: list = {}, isLoading: listLoading, error: listError } = useCurrencyList();
    const { data: series = [], isLoading, error: ratesError } = useRates(base.toLowerCase(), endDate);

    const sortedCodes = useMemo(() => Object.keys(list).sort(), [listLoading]);

    const max = today();
    const min = daysAgo(DAYS_AGO);

    const onSelectCounterCurrencies = useCallback((event: any) => {
        if (event.target.value?.length <= MAX_COUNTER_CURRENCIES &&
            event.target.value?.length >= MIN_COUNTER_CURRENCIES) {
            setSelected(event.target.value);
        }
    }, []);

    const onChangeDate = useCallback((event: any) => {
        if (!event.target?.value) {
            alert("Please select a valid date.");
            return;
        }

        setEndDate(event.target.value);
    }, []);

    return (
        <div className="grid">
            <form className="w-full max-w-3xl mx-auto bg-white/5 rounded-xl p-4 sm:p-6 border border-white/20 shadow-sm">
                {listError && <div className="text-red-400">Failed to load currency list</div>}
                {listLoading && <div className="py-6">Loading currencies..</div>}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                    <div className="flex flex-col">
                        <label className="block text-sm font-medium mb-1 text-left">Base Currency</label>
                        <DropdownSelect
                            data={sortedCodes}
                            value={base}
                            onChange={(e) => setBase(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="block text-sm font-medium mb-1 text-left">End Date</label>
                        <DatePicker
                            max={max}
                            min={min}
                            value={endDate}
                            onChange={onChangeDate}
                        />
                    </div>
                    <div className="sm:col-span-2 flex flex-col">
                        <label className="block text-sm font-medium mb-1 text-left">Counter Currencies (Select from 3 to 7)</label>
                        <MultiSelect
                            data={sortedCodes}
                            selected={selected}
                            onChange={onSelectCounterCurrencies}
                        />
                    </div>
                </div>
            </form>

            <div className="mt-4">
                {isLoading && <div className="py-6">Loading rates…</div>}
                {ratesError && <div className="py-4 text-red-400">{String(ratesError.message || ratesError)}</div>}
                {!isLoading && !ratesError && (
                    <div className="overflow-x-auto">
                        <Table data={series} selected={selected} />
                    </div>
                )}
                <p className="text-xs opacity-70 mt-3">
                    {DATA_SOURCE_ATTRIBUTION} {base.toUpperCase()}.
                </p>
            </div>
        </div>
    );
}

export default Home;