import {ThunkDispatch} from "@reduxjs/toolkit";
import appStateSlice from "../redux/slices/AppStateSlice";
import {ApiResponse} from "@hotel-management-system/models";

export const handleApiResponse = <T>(
    response: Promise<Response>,
    dispatch: ThunkDispatch<any, any, any>,
    onSuccess: (data: T) => void,
) => {
    response
    .then((response) => {
        return response.json();
      })
      .then((data: ApiResponse<T>) => {
        if (data.success) {
            onSuccess(data.data);
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
}