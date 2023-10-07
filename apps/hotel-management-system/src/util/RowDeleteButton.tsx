import {GridCellParams} from "@mui/x-data-grid";
import React, {useState} from "react";
import IconButton from "@mui/material/IconButton";
import {CircularProgress} from "@mui/material";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";

export const RowDeleteButton = (props: {
    params: GridCellParams,
    deleteFunction: (id: number) => void,
    idField: string
}) => {
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        await props.deleteFunction(props.params.row[props.idField]);
        setIsDeleting(false);
    }

    return (
        <IconButton size={"small"} color={"error"} onClick={handleDelete}
                    disabled={isDeleting}>
            {isDeleting ? <CircularProgress size={20}/> : <PersonRemoveIcon fontSize={"inherit"}/>}
        </IconButton>
    )

}