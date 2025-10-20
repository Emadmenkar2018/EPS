import { DropDownList } from "@progress/kendo-react-dropdowns";

type DropdownSelectProps = {
    data: string[];
    value: string;
    onChange: (event: any) => void;
};

export const DropdownSelect = ({ data, value , onChange }: DropdownSelectProps) => {
    return (
        <div className="flex-1">
            <DropDownList
                className="w-full rounded-xl bg-white/5 border border-white/20 px-3 py-2 text-left "
                data={data}
                value={value}
                onChange={onChange}
            />
        </div>
    );
};