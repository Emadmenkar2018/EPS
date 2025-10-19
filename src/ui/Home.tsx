import { useMemo, useState } from "react";
import { daysAgo, today } from "../helpers/utils";
import { useCurrencyList, useRates } from "../hooks/useRates";
import { Table } from "../components/Table";
import { MultiSelect } from "../components/MultiSelect";
import { DropdownSelect } from "../components/DropdownSelect";
import { DatePicker } from '@progress/kendo-react-dateinputs';

function Home() {
    const [base, setBase] = useState('gbp')
    const [selected, setSelected] = useState(['usd', 'eur', 'jpy', 'chf', 'cad', 'aud', 'zar'])
    const [endDate, setEndDate] = useState(today())
    const { data: list = {}, isLoading: listLoading, error: listError } = useCurrencyList();
    const { data: series = [], isLoading, error } = useRates(base, endDate);

    const sortedCodes = useMemo(() => Object.keys(list).sort(), [list])
    const max = today()
    const min = daysAgo(90)

    const [toAdd, setToAdd] = useState('')
    const canRemove = selected.length > 3;
    const canAdd = selected.length < 7;

    const onChange = (event: any) => {
        if (canAdd) {
            setToAdd(event.target.value);
        }
        else {
            setSelected(selected.filter(c => event.value.includes(c)));
        }
    };

    return (
        <div className="grid mb-10">
            {listError && <div className="text-red-400">Failed to load currency list</div>}

            <form className="w-full max-w-xl mx-auto bg-white/5 rounded-xl p-4 sm:p-6 border border-white/20 shadow-sm">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                    <div className="flex flex-col">
                        <label className="block text-sm font-medium mb-1 text-left">Base Currency</label>
                        <DropdownSelect
                            data={sortedCodes}
                            onChange={(e) => setBase(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="block text-sm font-medium mb-1 text-left">End Date</label>
                        <DatePicker
                            max={max}
                            min={min}
                            value={new Date(endDate)}
                            onChange={(e) => setEndDate(e.target.value ? e.target.value : endDate)}
                        />
                    </div>
                    <div className="sm:col-span-2 flex flex-col">
                        <label className="block text-sm font-medium mb-1 text-left">Currencies</label>
                        <MultiSelect
                            canRemove={canRemove}
                            canAdd={canAdd}
                            data={sortedCodes}
                            selected={selected}
                            value={toAdd}
                            onChange={onChange}
                        />
                    </div>
                </div>
            </form>

            <div className="mt-4">
                {isLoading && <div className="py-6">Loading rates…</div>}
                {error && <div className="py-4 text-red-400">{String(error.message || error)}</div>}
                {!isLoading && !error && (
                    <div className="overflow-x-auto">
                        <Table data={series} selected={selected} />
                    </div>
                )}
                <p className="text-xs opacity-70 mt-3">
                    Data source: @fawazahmed0/currency-api via jsDelivr. Values show how much of the target currency equals 1 {base.toUpperCase()}.
                </p>
            </div>
        </div>
    );
}

export default Home;