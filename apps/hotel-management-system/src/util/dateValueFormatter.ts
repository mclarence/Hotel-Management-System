import dayjs from "dayjs";
import {GridCellParams} from "@mui/x-data-grid";

export const dateValueFormatter = (timezone: string) => {
    return (params: GridCellParams) => {
        if (params.value === null) {
            return "...";
        }
        return dayjs.utc(params.value as string).tz(timezone).format('DD/MM/YYYY hh:mm a');
    }
}