export type PermissionData = {
    [key: string]: {
        read: boolean;
        write: boolean;
        delete: boolean;
    };
};
