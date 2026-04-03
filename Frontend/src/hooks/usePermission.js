import { useSelector } from "react-redux";
import { hasPermission } from "../utils/permission";

export const usePermission = (permission) => {

    const role =
        useSelector(
            (state) =>
                state.workspaceMembers.currentUserRole
        );

    return hasPermission(role, permission);
};