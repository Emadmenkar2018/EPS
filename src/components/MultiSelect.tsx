import { MultiSelect as KendoMultiSelect } from "@progress/kendo-react-dropdowns";

type MultiSelectProps = {
    data: string[];
    selected: string[];
    onChange: (event: any) => void;
};

export const MultiSelect = ({ data, selected, onChange }: MultiSelectProps) => {

    return (
        <KendoMultiSelect
            data={data}
            value={selected}
            onChange={onChange}
            className="w-full "
            placeholder="Enter Currency..."
        />
    );
};