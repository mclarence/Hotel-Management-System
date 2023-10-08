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
import { useEffect, useState } from "react";
import appStateSlice from "../../redux/slices/AppStateSlice";
import { useAppDispatch } from "../../redux/hooks";
import { searchGuests } from "../../api/guests";
import {Guest, ApiResponse} from "@hotel-management-system/models"

interface CheckInPageProps {}
const CheckInOutPage = (props: CheckInPageProps) => {
  const dispatch = useAppDispatch();
  const [autoCompleteOptions, setAutoCompleteOptions] = useState<Guest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  useEffect(() => {
    dispatch(appStateSlice.actions.setAppBarTitle("Check In/Out"));
    dispatch(appStateSlice.actions.setLastPageVisited("/check-in-out"));
  }, []);

  
  const handleAutoCompleteTypingChange = (event: any) => {
    searchGuests(event.target.value)
    .then((response) => {
      return response.json();
    })
    .then((data: ApiResponse<Guest[]>) => {
      if (data.success) {
        setAutoCompleteOptions(data.data);
      } else if (!data.success && data.statusCode === 401) {
        dispatch(
          appStateSlice.actions.setSnackBarAlert({
            show: true,
            message: data.message,
            severity: "warning",
          })
        );
      } else {
        if (data.statusCode === 400) {
          setAutoCompleteOptions([]);
          return;
        }
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

  const handleAutoCompleteSelectionChange = (event: any, value: any) => {
    setSelectedGuest(value);
  }
  
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
              getOptionLabel={(option) => option.firstName + " " + option.lastName}
              isOptionEqualToValue={(option, value) => option.guestId === value.guestId}
              onChange={handleAutoCompleteSelectionChange}
              id="combo-box-demo"
              options={autoCompleteOptions}
              renderInput={(params) => (
                <TextField  {...params} label="Guest Name" onChange={handleAutoCompleteTypingChange} />
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
                <Typography variant={"body1"}>{
                selectedGuest === null ? "..." : selectedGuest.firstName
                }</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant={"body1"}>Last Name:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant={"body1"}>
                {
                selectedGuest === null ? "..." : selectedGuest.lastName
                }
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant={"body1"}>Email:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant={"body1"}>
                {
                selectedGuest === null ? "..." : selectedGuest.email
                }
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant={"body1"}>Phone Number:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant={"body1"}>
                {
                selectedGuest === null ? "..." : selectedGuest.phoneNumber
                }
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant={"body1"}>Address:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant={"body1"}>
                {
                selectedGuest === null ? "..." : selectedGuest.address
                }
                </Typography>
              </Grid>
            </Grid>
          </Stack>
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper sx={{ padding: 2 }}>
          <Stack direction={"column"} gap={2}>
            <Typography variant={"h5"}>Reservations</Typography>
            <Divider />
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
                  field: "actions",
                  headerName: "Actions",
                  sortable: false,
                  filterable: false,
                  hideable: false,
                  disableReorder: true,
                  disableColumnMenu: true,
                  flex: 1,
                  renderCell: (params: any) => (
                    <Stack direction={"row"} gap={2}>
                        <Button color="success" variant="contained">Check In</Button>
                        <Button color="error" variant="contained">Check Out</Button>
                      </Stack>
                  ),
                },
              ]}
            />
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CheckInOutPage;
