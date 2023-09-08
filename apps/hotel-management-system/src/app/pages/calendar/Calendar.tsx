import { 
    LocalizationProvider,
    DateCalendar,
} from '@mui/x-date-pickers';

import { 
    AdapterDayjs 
} from '@mui/x-date-pickers/AdapterDayjs'

export default function Calendar () {
        return (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar showDaysOutsideCurrentMonth fixedWeekNumber={6} />
            </LocalizationProvider>
        )
};
