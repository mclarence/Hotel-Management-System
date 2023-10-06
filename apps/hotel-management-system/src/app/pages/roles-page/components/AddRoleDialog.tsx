import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DialogHeader } from "../../../../util/DialogHeader";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { addRole } from "../../../api/roles";
import { Role, ApiResponse } from "@hotel-management-system/models";
import { useAppDispatch } from "../../../redux/hooks";
import appStateSlice from "../../../redux/slices/AppStateSlice";
interface IAddRoleDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  refreshRoles: () => void;
}

export const AddRoleDialog = (props: IAddRoleDialogProps) => {
  const [hasChangedSomething, setHasChangedSomething] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [addPermissionTextfieldValue, setAddPermissionTextfieldValue] =
    useState("");
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
    setAddPermissionTextfieldValue("");
    setSaveButtonDisabled(true);
    setHasChangedSomething(false);
    setIsSubmitting(false);
  };

  const handleAddPermission = () => {
    if (addPermissionTextfieldValue.length > 0) {
      // check if permission already exists
      if (permissions.includes(addPermissionTextfieldValue)) {
        alert("Permission already exists");
        setAddPermissionTextfieldValue("");
        return;
      }

      setPermissions([...permissions, addPermissionTextfieldValue]);
      setAddPermissionTextfieldValue("");
    }
  };

  const handleDeletePermission = (permission: string) => {
    setPermissions(permissions.filter((p) => p !== permission));
  };

  const handleSubmit = () => {
    const newRole: Role = {
      name: roleName,
      permissionData: permissions,
    };

    addRole(newRole)
      .then((response) => {
        return response.json();
      })
      .then((data: ApiResponse<Role>) => {
        if (data.success) {
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
      <DialogHeader title="Add Role" onClose={handleClose} />
      <DialogContent>
        <Stack gap={2}>
          <Typography variant={"body1"}>
            Set role name and permissions below.
          </Typography>
          <TextField
            fullWidth
            required
            label="Role Name"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />
          <Paper sx={{ padding: 1 }}>
            <Stack direction={"row"} gap={1}>
              <TextField
                size="small"
                label="Enter Permission"
                onChange={(e) => setAddPermissionTextfieldValue(e.target.value)}
                value={addPermissionTextfieldValue}
              />
              <IconButton
                disabled={addPermissionTextfieldValue.length === 0}
                onClick={handleAddPermission}
              >
                <AddIcon />
              </IconButton>
            </Stack>
          </Paper>

          <Paper sx={{ overflowY: "scroll", maxHeight: "200px" }}>
            {permissions.length === 0 ? (
              <Typography variant="body1" sx={{ padding: 2 }}>
                No permissions selected
              </Typography>
            ) : (
              <List>
                {permissions.map((permission) => (
                  <ListItem
                    key={permission}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {permission}
                    <IconButton
                      color="error"
                      onClick={() => handleDeletePermission(permission)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>

          <Button
            variant={"contained"}
            color={"primary"}
            startIcon={<AddIcon />}
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
