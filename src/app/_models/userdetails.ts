export class Userdetails {
    firstName: string;
    lastName: string;
    currentRoleId: string;
    fullName: string;
    plantCode: string;
    userName: string;
    dateformat: string;
    email: string;
    assignedRoles: AssignedRoles[];
}
export class AssignedRoles {
    sno: string;
    roleId: string;
    roleDesc: string;
    defaultRole: string;
    userId: string;
}
export class TokenPayLoadData {
    userName: string;
    fullName: string;
    iss: string;
    exp: string;
    iat: string;
}
