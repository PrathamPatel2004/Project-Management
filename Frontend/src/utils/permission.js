import {
    ROLE_PERMISSIONS,
    ROLE_HIERARCHY,
} from "../config/rbac";

/* ------------------------------
   Check Permission
------------------------------ */

export const hasPermission = (
    role,
    permission
) => {

    if (!role) return false;

    const permissions =
        ROLE_PERMISSIONS[role] || [];

    return permissions.includes(
        permission
    );

};

/* ------------------------------
   Role Hierarchy Check
------------------------------ */

export const canManageRole = (
    currentRole,
    targetRole
) => {

    if (
        !currentRole ||
        !targetRole
    )
        return false;

    return (
        ROLE_HIERARCHY[currentRole] >
        ROLE_HIERARCHY[targetRole]
    );

};

/* ------------------------------
   Get Assignable Roles
   (Very Important)
------------------------------ */

export const getAssignableRoles = (
    currentRole
) => {

    if (!currentRole)
        return [];

    return Object.keys(
        ROLE_HIERARCHY
    ).filter(
        (role) =>
            ROLE_HIERARCHY[currentRole] >
            ROLE_HIERARCHY[role]
    );

};