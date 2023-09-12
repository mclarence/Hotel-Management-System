import Box from '@mui/material/Box';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import Typography from '@mui/material/Typography';


export function Calendar () {
    return (
        <div>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                }}>
            <Typography variant="h3" gutterBottom>
                Calendar
            </Typography>      
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <StaticDatePicker orientation="landscape" />
                </LocalizationProvider>
            </Box>
        </div>
    )
};
