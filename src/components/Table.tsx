import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';

export function Table({ data, selected }: { data: any[], selected: string[] }) {
    return (
        <Grid data={data}>
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