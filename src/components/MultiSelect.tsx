import { MultiSelect as KendoMultiSelect } from "@progress/kendo-react-dropdowns";
import { Label } from "@progress/kendo-react-labels";

type MultiSelectProps = {
    data: string[];
    selected: string[];
    value: any;
    canRemove: boolean;
    canAdd: boolean;
    onChange: (event: any) => void;
};

export const MultiSelect = ({ data, selected, value, onChange, canAdd, canRemove }: MultiSelectProps) => {

    return (
        <div>
            <KendoMultiSelect
                data={data}
                value={selected}
                onChange={onChange}
                className="w-full"
                // onChange={(event: any) => {
                //     if (
                //         canAdd &&
                //         (
                //             event.syntheticEvent?.type === "keydown" ||
                //             event.syntheticEvent?.key === "Enter" ||
                //             event.syntheticEvent?.type === "click"
                //         )
                //     ) {
                //         onChange(event);
                //     }
                //     else{
                //         onChange({
                //             ...event,
                //             value: selected.filter(c => event.value.includes(c))
                //         });
                //     }
                // }}
                // allowCustom={canAdd}
                placeholder="Enter Currency..."
            />
        </div>
    );
};