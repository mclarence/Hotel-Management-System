import { DialogTitle, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

interface IDialogHeaderProps {
  title: string;
  onClose: () => void;
}

export const DialogHeader = (props: IDialogHeaderProps) => {
  return (
    <>
      <DialogTitle>{props.title}</DialogTitle>
      <Divider />
      <IconButton
        aria-label="close"
        onClick={props.onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
    </>
  );
};
