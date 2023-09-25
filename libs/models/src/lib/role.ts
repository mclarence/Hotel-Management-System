import {PermissionData} from "./permissionData";

export type Role = {
    roleId: number;
    name: string;
    permissionData: PermissionData;
}