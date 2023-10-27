import {
    Button,
    Dialog,
    DialogContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import Divider from "@mui/material/Divider";
import {Role, User} from "@hotel-management-system/models";
import {useEffect, useState} from "react";
import {getRoles} from "../../../api/resources/roles";
import {useAppDispatch} from "../../../redux/hooks";
import appStateSlice from "../../../redux/slices/AppStateSlice";
import EditIcon from "@mui/icons-material/Edit";
import {updateUser} from "../../../api/resources/users";
import {DialogHeader} from "../../../../util/components/DialogHeader";
import {makeApiRequest} from "../../../api/makeApiRequest";

interface EditUserDialog {
    user: User | null;
    open: boolean;
    setOpen: (open: boolean) => void;
    refreshUsers: () => void;
}

export const EditUserDialog = (props: EditUserDialog) => {
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasChangedSomething, setHasChangedSomething] = useState(false);
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

    const handleEditUser = () => {
        setIsSubmitting(true);
        const editedUser: User = {
            userId: props.user?.userId || 0,
            firstName: firstName,
            lastName: lastName,
            email: emailAddress,
            phoneNumber: phoneNumber,
            username: username,
            position: position,
            roleId: parseInt(selectedRoleId),
        };

        if (password) {
            editedUser.password = password;
        }

        makeApiRequest<User>(
            updateUser(editedUser),
            dispatch,
            (data) => {
                props.setOpen(false);
                resetState();
                props.refreshUsers();
                dispatch(
                    appStateSlice.actions.setSnackBarAlert({
                        show: true,
                        message: "User updated successfully",
                        severity: "success",
                    })
                );
            },
            () => {
                setIsSubmitting(false);
            }
        )
    };

    useEffect(() => {
        if (
            firstName !== props.user?.firstName ||
            lastName !== props.user?.lastName ||
            username !== props.user?.username ||
            password ||
            phoneNumber !== props.user?.phoneNumber ||
            emailAddress !== props.user?.email ||
            position !== props.user?.position ||
            selectedRoleId !== props.user?.roleId.toString()
        ) {
            setSaveButtonDisabled(false);
            setHasChangedSomething(true);
        } else {
            setSaveButtonDisabled(true);
            setHasChangedSomething(false);
        }
    }, [
        firstName,
        lastName,
        username,
        password,
        selectedRoleId,
        phoneNumber,
        emailAddress,
        position
    ]);

    useEffect(() => {
        makeApiRequest<Role[]>(
            getRoles(),
            dispatch,
            (data) => {
                setRoles(data);
            }
        )
    }, []);

    useEffect(() => {
        setFirstName(props.user?.firstName || "");
        setLastName(props.user?.lastName || "");
        setEmailAddress(props.user?.email || "");
        setPhoneNumber(props.user?.phoneNumber || "");
        setUsername(props.user?.username || "");
        setPosition(props.user?.position || "");
        setSelectedRoleId(props.user?.roleId.toString() || "");
    }, [props.user, props.open]);

    return (
        <Dialog open={props.open} fullWidth>
            <DialogHeader title={`Editing User: ${props.user?.firstName} ${props.user?.lastName}`}
                          onClose={handleClose}/>
            <DialogContent>
                <Stack gap={2}>
                    <Typography component={'span'} variant={"body1"}>
                        Update user details below. The first name, last name, username,
                        password and role fields are required.
                    </Typography>
                    <Typography component={'span'} variant={"subtitle2"}>User Details</Typography>
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
                    <Divider/>
                    <Typography component={'span'} variant={"subtitle2"}>Account Details</Typography>
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
                        placeholder="(unchanged)"
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
                        startIcon={<EditIcon/>}
                        disabled={saveButtonDisabled || isSubmitting}
                        onClick={handleEditUser}
                    >
                        {isSubmitting ? "Updating user..." : "Edit User"}
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};
