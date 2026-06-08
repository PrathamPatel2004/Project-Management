import { useParams, Navigate } from "react-router-dom";
import ProjectDetailsLayout from "../pages/ProjectDetailsLayout";

const RequireProjectId = () => {
    const { id } = useParams();

    if (!id) {
        return <Navigate to="/projects" replace state={{ message: "Please select a project from workspace projects" }} />;
    }

    return <ProjectDetailsLayout />;
};

export default RequireProjectId;