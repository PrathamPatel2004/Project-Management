export const ROLES = {
    OWNER: "Owner",
    ADMIN: "Admin",
    PROJECT_MANAGER: "Project Manager",
    MEMBER: "Member",
    GUEST: "Guest",
};

/* Role Hierarchy (Higher → Lower) */

export const ROLE_HIERARCHY = {
    Owner: 5,
    Admin: 4,
    "Project Manager": 3,
    Member: 2,
    Guest: 1,
};

/* Permissions */

export const ROLE_PERMISSIONS = {
    Owner: [
        "workspace.update",
        "workspace.delete",
        "member.invite",
        "member.remove",
        "member.updateRole",
        "project.create",
        "project.delete",
    ],

    Admin: [
        "member.invite",
        "member.updateRole",
        "project.create",
        "project.update",
    ],

    "Project Manager": [
        "project.create",
        "task.assign",
        "task.update",
    ],

    Member: [
        "task.update",
        "task.comment",
    ],

    Guest: [
        "project.view",
        "task.view",
    ],
};