export class Collaborator {

}
export class ReportDashboardPermission {
    permissionId: number;
    reportId: string;
    userId: string;
    roleId: string;
    groupId: string;
    isEditable: boolean;
    isViewable: boolean;
    isDeleteable: boolean;
    permissionType: PermissionType;
    description: string;
    userMdoModel: UserMdoModel;
    rolesModel: RolesModel;
    groupHeaderModel: GroupHeaderModel;
}

export enum PermissionType {
    USER = 'USER',
    ROLE = 'ROLE',
    GROUP = 'GROUP'
}

export interface PermissionOn {
    users: UserMdoModel[];
    roles: RolesModel[];
    groups: GroupHeaderModel[];

}

export interface UserMdoModel {
    userId: string;
    userName: string;
    fName: string;
    lName: string;
    fullName: string;
    email: string;
}
export interface RolesModel {
    roleId: string;
    roleDesc: string;
}
export interface GroupHeaderModel {
    groupId: number;
    groupIdAsStr: string;
    description: string;
}