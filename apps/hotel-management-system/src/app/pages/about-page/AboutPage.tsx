import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
export const AboutPage = () => {
    return (
        <>
            <Paper sx={{padding:2}}>
                <Typography variant={"h4"}>About Us</Typography>
                <Divider sx={{mt: 2, mb: 2}}/>
                <Typography variant={"body1"}>
                    This application is a hotel management system. It is a web application that allows hotel staff to manage various aspects of the hotel such as rooms, guests, reservations, and transactions.
                    It was developed as part of a project for the course "41026 - Advanced Software Development" at the University of Technology Sydney.
                    We are the developers of a web application that aims to transform hotel operations. Our programme is an easy-to-use tool that makes hotel employees' jobs more productive on a variety of levels.
                    With our software, you may establish bespoke roles with admin powers and other features to meet your specific needs. Employees can easily manage guest services, amend room details, add customers, and change prices.
                    Our app has been created over the course of three versions, guaranteeing a seamless launch and ongoing enhancement. Key information are available on our dashboard, allowing for data-driven decision-making for improved visitor experiences and efficient operations.
                    All activity is tracked via our integrated log function, which encourages accountability and openness. By preventing unforeseen changes, role-based access control improves system security.
                    We're here to use technology and reliable support to enable your hotel's success. Greetings from a new era in hotel administration!
                </Typography>
            </Paper>
        </>
    )
}