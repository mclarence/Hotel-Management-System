import {Dialog, DialogContent, Stack, Typography} from '@mui/material';
import {DialogHeader} from "../../../../util/components/DialogHeader";

export const CreateReservationDialog = (props: {
  open: boolean;
  setOpen: (open: boolean) => void;
  fetchReservations: () => void;
}) => {
  const handleClose = () => {
    
  };
  return (
    <Dialog open={props.open} fullWidth>
      <DialogHeader title={'Create Reservation'} onClose={handleClose} />
      <DialogContent>
        <Stack gap={2}>
          <Typography component={'span'} variant={'body1'}>Enter reservation details below.</Typography>
          <Typography component={'span'} variant={'subtitle2'}>Reservation Details</Typography>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};