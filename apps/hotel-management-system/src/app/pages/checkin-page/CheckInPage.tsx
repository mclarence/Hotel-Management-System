import {
  Autocomplete,
  Button,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";

interface CheckInPageProps {}
const CheckInPage = (props: CheckInPageProps) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper sx={{ padding: 2 }}>
          <Stack
            direction={"row"}
            gap={2}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Typography variant={"body1"} sx={{ width: "150px" }}>
              Enter Guest Name:
            </Typography>
            <Autocomplete
              fullWidth
              id="combo-box-demo"
              options={["test"]}
              renderInput={(params) => (
                <TextField {...params} label="Guest Name" />
              )}
            />
          </Stack>
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper sx={{ padding: 2 }}>
          <Stack direction={"column"} gap={2}>
            <Typography variant={"h5"}>Guest Details</Typography>
            <Divider />
            <Grid container>
              <Grid item xs={6}>
                <Typography variant={"body1"}>First Name:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant={"body1"}>first name here</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant={"body1"}>Last Name:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant={"body1"}>last name here</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant={"body1"}>Email:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant={"body1"}>email here</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant={"body1"}>Phone Number:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant={"body1"}>phone number here</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant={"body1"}>Address:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant={"body1"}>address here</Typography>
              </Grid>
            </Grid>
          </Stack>
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper sx={{ padding: 2 }}>
          <Stack direction={"column"} gap={2}>
            <Typography variant={"h5"}>Reservations</Typography>
            <Divider/>
            {/* create a datagrid listing the guests current reservations */}
            <DataGrid
                checkboxSelection={false}
                rows={[
                    { id: 1, col1: "1", col2: "01-01-01", col3: "101" },
                    { id: 2, col1: "XGrid", col2: "is Awesome" },
                    { id: 3, col1: "Material-UI", col2: "is Amazing" },
                ]}
                columns={[
                    { field: "col1", headerName: "Reservation ID", width: 150 },
                    { field: "col2", headerName: "Reservation Date", width: 150 },
                    { field: "col3", headerName: "Room Number", width: 150 },
                    {
                        field: 'actions',
                        headerName: 'Actions',
                        sortable: false,
                        filterable: false,
                        hideable: false,
                        disableReorder: true,
                        disableColumnMenu: true,
                        renderCell: (params: any) => (
                            <>
                                <Button>
                                    Check In
                                </Button>
                            </>
                        )
                    },
                ]}
            />
            
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CheckInPage;
