export const ROLES = {
    OWNER: "Owner",
    ADMIN: "Admin",
    PROJECT_MANAGER: "Project Manager",
    MEMBER: "Member",
    GUEST: "Guest",
};

export const PERMISSIONS = {
    WORKSPACE_VIEW: "workspace:view",
    WORKSPACE_UPDATE: "workspace:update",
    WORKSPACE_DELETE: "workspace:delete",
    WORKSPACE_INVITE: "workspace:invite",
    WORKSPACE_REMOVE_MEMBER: "workspace:remove_member",

    MEMBER_VIEW: "member:view",
    MEMBER_UPDATE_ROLE: "member:update_role",

    PROJECT_CREATE: "project:create",
    PROJECT_VIEW: "project:view",
    PROJECT_UPDATE: "project:update",
    PROJECT_DELETE: "project:delete",
    PROJECT_ARCHIVE: "project:archive",

    TASK_CREATE: "task:create",
    TASK_VIEW: "task:view",
    TASK_UPDATE: "task:update",
    TASK_DELETE: "task:delete",
    TASK_ASSIGN: "task:assign",
    TASK_MOVE: "task:move",

    COMMENT_CREATE: "comment:create",
    COMMENT_DELETE: "comment:delete",
};

export const ROLE_HIERARCHY = {
    [ROLES.OWNER]: 5,
    [ROLES.ADMIN]: 4,
    [ROLES.PROJECT_MANAGER]: 3,
    [ROLES.MEMBER]: 2,
    [ROLES.GUEST]: 1,
};

export const ROLE_PERMISSIONS = {
    [ROLES.OWNER]: [
        ...Object.values(PERMISSIONS),
    ],
    [ROLES.ADMIN]: [
        PERMISSIONS.WORKSPACE_VIEW,
        PERMISSIONS.WORKSPACE_UPDATE,
        PERMISSIONS.WORKSPACE_INVITE,
        PERMISSIONS.WORKSPACE_REMOVE_MEMBER,

        PERMISSIONS.MEMBER_VIEW,
        PERMISSIONS.MEMBER_UPDATE_ROLE,

        PERMISSIONS.PROJECT_CREATE,
        PERMISSIONS.PROJECT_VIEW,
        PERMISSIONS.PROJECT_UPDATE,
        PERMISSIONS.PROJECT_DELETE,
        PERMISSIONS.PROJECT_ARCHIVE,

        PERMISSIONS.TASK_CREATE,
        PERMISSIONS.TASK_VIEW,
        PERMISSIONS.TASK_UPDATE,
        PERMISSIONS.TASK_DELETE,
        PERMISSIONS.TASK_ASSIGN,
        PERMISSIONS.TASK_MOVE,

        PERMISSIONS.COMMENT_CREATE,
        PERMISSIONS.COMMENT_DELETE,
    ],

    [ROLES.MEMBER]: [
        PERMISSIONS.WORKSPACE_VIEW,

        PERMISSIONS.MEMBER_VIEW,

        PERMISSIONS.PROJECT_VIEW,

        PERMISSIONS.TASK_CREATE,
        PERMISSIONS.TASK_VIEW,
        PERMISSIONS.TASK_UPDATE,
        PERMISSIONS.TASK_ASSIGN,
        PERMISSIONS.TASK_MOVE,

        PERMISSIONS.COMMENT_CREATE,
        PERMISSIONS.COMMENT_DELETE,
    ],

    [ROLES.PROJECT_MANAGER]: [
        PERMISSIONS.WORKSPACE_VIEW,

        PERMISSIONS.MEMBER_VIEW,
        PERMISSIONS.MEMBER_UPDATE_ROLE,

        PERMISSIONS.PROJECT_CREATE,
        PERMISSIONS.PROJECT_VIEW,
        PERMISSIONS.PROJECT_UPDATE,
        PERMISSIONS.PROJECT_DELETE,
        PERMISSIONS.PROJECT_ARCHIVE,

        PERMISSIONS.TASK_CREATE,
        PERMISSIONS.TASK_VIEW,
        PERMISSIONS.TASK_UPDATE,
        PERMISSIONS.TASK_DELETE,
        PERMISSIONS.TASK_ASSIGN,
        PERMISSIONS.TASK_MOVE,

        PERMISSIONS.COMMENT_CREATE,
        PERMISSIONS.COMMENT_DELETE,
    ], 

    [ROLES.GUEST]: [
        PERMISSIONS.WORKSPACE_VIEW,

        PERMISSIONS.MEMBER_VIEW,

        PERMISSIONS.TASK_VIEW,
    ],
};

export const hasPermission = (role, permission) => {
    return ROLE_PERMISSIONS[role]?.includes(permission);
};

export const canActOn = (actorRole, targetRole) => {
    return ROLE_HIERARCHY[actorRole] > ROLE_HIERARCHY[targetRole];
};

export const isSelfAction = (actorUserId, targetUserId) => {
    return String(actorUserId) === String(targetUserId);
};

export const canUpdateRole = ({
    actorRole,
    targetRole,
    actorUserId,
    targetUserId,
}) => {
    if (!hasPermission(actorRole, PERMISSIONS.MEMBER_UPDATE_ROLE)) return false;

    if (isSelfAction(actorUserId, targetUserId)) return false;

    return canActOn(actorRole, targetRole);
};

export const canRemoveMember = ({
    actorRole,
    targetRole,
    actorUserId,
    targetUserId,
}) => {
    if (!hasPermission(actorRole, PERMISSIONS.WORKSPACE_REMOVE_MEMBER)) return false;

    if (isSelfAction(actorUserId, targetUserId)) return false;

    return canActOn(actorRole, targetRole);
};

export const canAssignRole = (actorRole, newRole) => {
    return ROLE_HIERARCHY[actorRole] > ROLE_HIERARCHY[newRole];
};