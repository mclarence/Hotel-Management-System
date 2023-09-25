import {IRolesDAO} from "../database/roles";

export interface IPermissionChecker {
    (requiredPermission: string, roleId: number): Promise<boolean>
}
const makePermissionChecker = (rolesDAO: IRolesDAO): IPermissionChecker => {

    const {
        getRoleById
    } = rolesDAO;

    return (requiredPermission: string, roleId: number): Promise<boolean> => {
        return new Promise<boolean>((resolve, reject) => {
            getRoleById(roleId).then(role => {
                if (role === null) {
                    resolve(false);
                }

                Object.keys(role.permissionData).forEach(key => {

                    // If the key is '*', the user has all permissions
                    if (key === '*') {
                        resolve(true);
                    }

                    /**
                     * [permission_node] : {
                     *     read: boolean,
                     *     write: boolean,
                     *     delete: boolean
                     * }
                     */

                    // If the permission node is the required permission, check if the user has the required permission
                    // requiredpermissions is in the format [permission_node].[read/write/delete]
                    if (key === requiredPermission.split('.')[0]) {
                        resolve(role.permissionData[key][requiredPermission.split('.')[1]]);
                    }
                })

                resolve(false);
            })
        })
    };
}


export default makePermissionChecker;