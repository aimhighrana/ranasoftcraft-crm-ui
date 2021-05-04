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

export class UserPersonalDetails {
    avatarURL: string;
    fb: string;
    name: string;
    fname: string;
    linkedin: string;
    lname: string;
    mname: string;
    pemail: string;
    phone: number;
    profileKey: {
        tenantId: string;
        userName: string;
    }
    publicName: string;
    semail: string;
    twitter: string;
}

export class UserPreferenceDetails {
    dFormat: string;
    lang: string;
    nformat: string;
    profileKey: UserPreferenceDetailsProfileKey;
    tformat: string;
    timezone: string;
}

export class UserPreferenceDetailsProfileKey {
    tenantId: string;
    userName: string;
}

export class UserPasswordDetails {
    confirmPassword: string;
    newPassword: string;
    oldPassword: string;
}