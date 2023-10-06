import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import Divider from "@mui/material/Divider";
import { ApiResponse, Role, User } from "@hotel-management-system/models";
import { useEffect, useState } from "react";
import { getRoles } from "../../../api/roles";
import { useAppDispatch } from "../../../redux/hooks";
import appStateSlice from "../../../redux/slices/AppStateSlice";
import { addUser } from "../../../api/users";
import { DialogHeader } from "../../../../util/DialogHeader";


interface AddUserDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  refreshUsers: () => void;
}

export const AddUserDialog = (props: AddUserDialogProps) => {
  const [roles, setRoles] = useState([] as Role[]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [position, setPosition] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
  const [hasChangedSomething, setHasChangedSomething] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();

  const handleRoleChange = (event: SelectChangeEvent) => {
    setSelectedRoleId(event.target.value);
  };

  const resetState = () => {
    //reset all fields
    setFirstName("");
    setLastName("");
    setEmailAddress("");
    setPhoneNumber("");
    setUsername("");
    setPassword("");
    setSelectedRoleId("");
    setPosition("");
  };

  const handleClose = () => {
    // ask user if they want to discard changes
    if (hasChangedSomething) {
      if (window.confirm("Are you sure you want to discard changes?")) {
        resetState();
        props.setOpen(false);
      }
    } else {
        resetState();
        props.setOpen(false);
    }
  };

  const handleAddUser = () => {
    setIsSubmitting(true);
    const newUser: User = {
      firstName: firstName,
      lastName: lastName,
      email: emailAddress,
      phoneNumber: phoneNumber,
      username: username,
      password: password,
      position: position,
      roleId: parseInt(selectedRoleId),
    };

    // send request to add user
    addUser(newUser)
      .then((response) => {
        return response.json();
      })
      .then((data: ApiResponse<User>) => {
        if (data.success) {
          props.setOpen(false);
          resetState();
          props.refreshUsers();
          dispatch(
            appStateSlice.actions.setSnackBarAlert({
              show: true,
              message: "User added successfully",
              severity: "success",
            })
          );
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
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  useEffect(() => {
    if (
        firstName !== "" ||
        lastName !== "" ||
        username !== "" ||
        password !== "" ||
        selectedRoleId !== "" ||
        emailAddress !== "" ||
        phoneNumber !== "" ||
        position !== ""
      ) {
        setHasChangedSomething(true);
      } else {
        setHasChangedSomething(false);
      }


    if (
      firstName !== "" &&
      lastName !== "" &&
      username !== "" &&
      password !== "" &&
      selectedRoleId !== ""
    ) {
      setSaveButtonDisabled(false);
    } else {
      setSaveButtonDisabled(true);
    }
  }, [firstName, lastName, username, password, selectedRoleId, emailAddress, phoneNumber, position]);

  useEffect(() => {
    getRoles()
      .then((response) => {
        return response.json();
      })
      .then((data: ApiResponse<Role[]>) => {
        if (data.success) {
          setRoles(data.data);
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
  }, []);

  return (
    <Dialog open={props.open} fullWidth>
      <DialogHeader title={"Add User"} onClose={handleClose} />
      <DialogContent>
        <Stack gap={2}>
          <Typography variant={"body1"}>
            Enter user details below. The first name, last name, username,
            password and role fields are required.
          </Typography>
          <Typography variant={"subtitle2"}>User Details</Typography>
          <Stack direction={"row"} gap={"inherit"}>
            <TextField
              fullWidth
              required
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              fullWidth
              required
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Stack>
          <TextField
            fullWidth
            label="Email Address"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
          />
          <TextField
            fullWidth
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <TextField
            fullWidth
            label="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />

          <Divider />
          <Typography variant={"subtitle2"}>Account Details</Typography>
          <TextField
            fullWidth
            required
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            fullWidth
            required
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControl fullWidth required>
            <InputLabel id="demo-simple-select-label">Role</InputLabel>
            <Select
              label="Role"
              value={selectedRoleId}
              onChange={handleRoleChange}
              required
            >
              {roles.map((role) => (
                <MenuItem key={role.roleId} value={role.roleId}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant={"contained"}
            color={"primary"}
            startIcon={<PersonAddIcon />}
            disabled={saveButtonDisabled || isSubmitting}
            onClick={handleAddUser}
          >
            {isSubmitting ? "Adding user..." : "Add User"}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
