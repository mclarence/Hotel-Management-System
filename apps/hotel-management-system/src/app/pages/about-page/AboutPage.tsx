import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
export const AboutPage = () => {
    return (
        <>
            <Paper sx={{padding:2}}>
                <Typography variant={"h4"}>About</Typography>
                <Divider sx={{mt: 2, mb: 2}}/>
                <Typography variant={"body1"}>
                    This application is a hotel management system. It is a web application that allows hotel staff to manage various aspects of the hotel such as rooms, guests, reservations, and transactions.
                    It was developed as part of a project for the course "41026 - Advanced Software Development" at the University of Technology Sydney.
                </Typography>
            </Paper>
        </>
    )
}