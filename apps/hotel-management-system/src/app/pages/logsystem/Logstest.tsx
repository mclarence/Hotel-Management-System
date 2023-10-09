import React, {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {fetchLogs} from "../../redux/slices/AppStateSlice";
import {RootState, AppDispatch} from "../../redux/store";

const Logtest = () => {
    const logs = useSelector((state: RootState) => state.appState.logs);
    const isFetchingLogs = useSelector((state: RootState) => state.appState.isFetchingLogs);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchLogs());
    }, [dispatch]);


    if (logs.length === 0) {
        return (
            <div>
                <h2>Logs</h2>
                <p>No logs available.</p>
            </div>
        );
    }

    return (
        <div>
            <h2>Logs</h2>
            <ul>
                {
                    isFetchingLogs ? <div>
                        Loading logs...
                    </div> : logs.length === 0 ? <div> No logs available. </div> : <div>
                        {logs.map(log => (
                            <li key={log.logId}>
                                Type: {log.operationType} -
                                Timestamp: {log.timestamp.toLocaleString()} -
                                Operated by: {log.operatedBy} -
                                Guest: {log.guestName || 'N/A'} -
                                Details: {log.additionalInfo || 'N/A'}
                            </li>
                        ))}
                    </div>
                }
            </ul>
        </div>
    );
}

export default Logtest;
