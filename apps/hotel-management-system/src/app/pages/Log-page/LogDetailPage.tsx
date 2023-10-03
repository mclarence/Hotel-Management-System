// src/pages/Log-page/LogDetailPage.tsx

import React from 'react';
import { useParams } from 'react-router-dom';

export const LogDetail = () => {
    const { logId } = useParams();

    return (
        <div>
            <h2>Log Detail and Edit</h2>
            {/* 根据logId从API或其他地方获取日志详细信息，并提供编辑功能 */}
            Here is the detail and edit option for log with ID: {logId}
        </div>
    );
}
