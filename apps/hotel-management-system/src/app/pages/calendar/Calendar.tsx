import { 
        Box, 
    } from '@mui/system';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { getNoteById } from '../../api/calendar';
import { ApiResponse, calendarNotes } from '@hotel-management-system/models';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useAppDispatch } from '../../redux/hooks';
import appStateSlice from '../../redux/slices/AppStateSlice';

export function Calendar () {
    const appState = useSelector((state: RootState) => state.appState);
    const dispatch = useAppDispatch();
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs(new Date()));
    const [currentNote, setCurrentNote] = useState<String | null>("");

    const handleButtonClick = () => {
        const text = prompt('Add a note');
        //run code to add note to date
    }
    
    useEffect(() => {
        if (selectedDate != null){
            getNoteById(selectedDate.toDate()).then((response) => {
                return response.json();
            })
            .then((data: ApiResponse<calendarNotes>) => {
                if (data.success) {
                setCurrentNote(data.data.note);
                } else if (!data.success && data.statusCode === 401) {
                dispatch(
                    appStateSlice.actions.setSnackBarAlert({
                    show: true,
                    message: data.message,
                    severity: "warning",
                    })
                );
                } else {
                dispatch(
                    appStateSlice.actions.setSnackBarAlert({
                    show: true,
                    message: data.message,
                    severity: "error",
                    })
                );
                }
            })
            .catch(() => {
                dispatch(
                appStateSlice.actions.setSnackBarAlert({
                    show: true,
                    message: "An unknown error occurred",
                    severity: "error",
                })
                );
            });
        }
    }, [selectedDate])

    return (
        <div>
            <Box //prints out the Calendar title
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                }}>
            <Typography variant="h3" gutterBottom>
                Calendar
            </Typography>      
            </Box>

            <Box //shows the calendar features
                sx={{
                    
                    display: 'flex',
                    justifyContent: 'center',
                    size: 'large',
                }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar value={selectedDate} onChange={(newValue) => setSelectedDate(newValue)} />
                {currentNote}
                
                </LocalizationProvider>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '87%',
                }}>
                <Fab size="small" aria-label="add" onClick = {handleButtonClick}>
                    <AddIcon/>
                </Fab>
            </Box>
        </div>
    )
};
