import { 
        Box, 
        ThemeProvider, 
        createTheme 
    } from '@mui/system';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';


export function Calendar () {
    const theme = createTheme(
        
    );
    
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
                <DateCalendar />
                
                </LocalizationProvider>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '87%',
                    height: '90%',
                }}>
                <Fab size="small" aria-label="add">
                    <AddIcon />
                </Fab>
            </Box>
        </div>
    )
};
