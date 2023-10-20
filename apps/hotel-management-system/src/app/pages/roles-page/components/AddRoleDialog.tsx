import {
    Button,
    Dialog,
    DialogContent,
    IconButton,
    List,
    ListItem,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import {DialogHeader} from "../../../../util/components/DialogHeader";
import {useEffect, useState} from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {addRole} from "../../../api/resources/roles";
import {Role} from "@hotel-management-system/models";
import {useAppDispatch} from "../../../redux/hooks";
import appStateSlice from "../../../redux/slices/AppStateSlice";
import {makeApiRequest} from "../../../api/makeApiRequest";
import {PermissionEditor} from "./PermissionEditor";

interface IAddRoleDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    refreshRoles: () => void;
}

export const AddRoleDialog = (props: IAddRoleDialogProps) => {
    const [hasChangedSomething, setHasChangedSomething] = useState(false);
    const [roleName, setRoleName] = useState("");
    const [permissions, setPermissions] = useState([] as string[]);
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (roleName.length > 0 && permissions.length > 0) {
            setSaveButtonDisabled(false);
        } else {
            setSaveButtonDisabled(true);
        }
    }, [permissions, roleName]);

    const resetState = () => {
        setRoleName("");
        setPermissions([]);
        setSaveButtonDisabled(true);
        setHasChangedSomething(false);
        setIsSubmitting(false);
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        const newRole: Role = {
            name: roleName,
            permissionData: permissions,
        };

        makeApiRequest<Role>(
            addRole(newRole),
            dispatch,
            (data) => {
                props.setOpen(false);
                resetState();
                props.refreshRoles();
                dispatch(
                    appStateSlice.actions.setSnackBarAlert({
                        show: true,
                        message: "Role added successfully",
                        severity: "success",
                    })
                );
            },
            () => {
                setIsSubmitting(false);
            }
        )
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

    return (
        <Dialog open={props.open}>
            <DialogHeader title="Add Role" onClose={handleClose}/>
            <DialogContent>
                <Stack gap={2}>
                    <Typography component={'span'} variant={"body1"}>
                        Set role name and permissions below.
                    </Typography>
                    <TextField
                        fullWidth
                        required
                        label="Role Name"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                    />

                    <PermissionEditor permissions={permissions} setPermissions={setPermissions}/>
                    <Button
                        variant={"contained"}
                        color={"primary"}
                        startIcon={<AddIcon/>}
                        disabled={saveButtonDisabled || isSubmitting}
                        onClick={handleSubmit}
                    >
                        {isSubmitting ? "Adding role..." : "Add Role"}
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};
