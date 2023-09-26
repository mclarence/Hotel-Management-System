import {IRolesDAO} from "../database/roles";

export interface IPermissionChecker {
    (requiredPermission: string, roleId: number): Promise<boolean>
}
const makePermissionChecker = (rolesDAO: IRolesDAO): IPermissionChecker => {

    const {
        getRoleById
    } = rolesDAO;

    return (requiredPermission: string, roleId: number): Promise<boolean> => {
        return new Promise<boolean>((resolve) => {
            getRoleById(roleId).then(role => {
                if (role === null) {
                    resolve(false);
                }

                const permissions = role.permissionData;
                if (permissions.includes(requiredPermission) || permissions.includes("*")) {
                    resolve(true);
                }

                resolve(false);
            })
        })
    };
}


export default makePermissionChecker;