import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchLogs } from "../../redux/slices/AppStateSlice"; 
import { RootState, AppDispatch } from "../../redux/store"; 


const LogsComponent = () => {
    const logs = useSelector((state: RootState) => state.appState.logs);
    const isFetchingLogs = useSelector((state: RootState) => state.appState.isFetchingLogs);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchLogs());
    }, [dispatch]);

    if (isFetchingLogs) {
        return <div>Loading logs...</div>;
    }

    return (
        <div>
        <h2>Logs</h2>
        <ul>
            {logs.map(log => (
                <li key={log.logId}>
                    Type: {log.operationType} - 
                    Timestamp: {log.timestamp.toLocaleString()} - 
                    Operated by: {log.operatedBy} - 
                    Guest: {log.guestName || 'N/A'} - 
                    Details: {log.additionalInfo || 'N/A'}
                </li>
            ))}
        </ul>
    </div>
    );
}

export default LogsComponent;
