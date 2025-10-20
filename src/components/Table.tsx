import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';

type TableProps = {
    data: any[];
    selected: string[];
};

export function Table({ data, selected }: TableProps) {
    return (
        <Grid data-testid="grid" data={data}>
            <Column
                field="date"
                title="Date"
            />
            {selected.map((code) => (
                <Column
                    key={code}
                    field={`rates.${code}`}
                    title={code}
                    format="{0:n4}" />
            ))}
        </Grid>
    );
}