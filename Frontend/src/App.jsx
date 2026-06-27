import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext'
import RequireProjectId from './components/RequireProjectId';
import Home from './pages/Home';
import Layout from './pages/Layout';
import Projects from './pages/Projects';
import Dashboard from './pages/Dashboard';
import WorkspaceActivities from './pages/WorkspaceActivities';
import Team from './pages/Team';
import Settings from './pages/Settings';
import ProjectDetails from './pages/ProjectDetails';
import ProjectDetailsLayout from './pages/ProjectDetailsLayout';
import TeamInvitations from './pages/TeamInvitations';
import WorkspaceInviteAccept from './components/WorkspaceInviteAccept';
import ProjectOverview from './pages/ProjectOverview';
import ProjectMembers from './pages/ProjectMembers';
import ProjectSettingsPage from './pages/ProjectSettings';
import ProjectTasks from './pages/ProjectTasks';

function AppProvider() {
    const { user } = useAuth();
    return ( 
        <Router>
            <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                duration: 4000,
                success: {
                    iconTheme: {
                        primary: "#22c55e",
                        secondary: "#fff",
                    },
                },
                error: {
                    iconTheme: {
                        primary: "#ef4444",
                        secondary: "#fff",
                    },
                },
                style: {
                    borderRadius: "12px",
                    background: "#121d7bff",
                    color: "#fff",
                    fontSize: "14px",
                    dark: {
                        background: "#36ffdaff",
                        color: "#000000ff",
                    }
                },}}
            />
            <Routes>
                <Route path='/' element={<Layout />}>
                    <Route index element={user ? <Navigate to="/dashboard" replace /> : <Home />} />
                    {user && (
                        <>
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path='dashboard/activity' element={<WorkspaceActivities />} />
                            <Route path='projects' element={<Projects />} />
                            <Route path='team' element={<Team />} />
                            <Route path='team/invitations' element={<TeamInvitations />} />
                            <Route path='settings' element={<Settings />} />
                            <Route path='profile' element={<Dashboard />} />
                            <Route path='project/details' element={<RequireProjectId />} />
                            <Route path="project/details/:id" element={<ProjectDetailsLayout />}>
                                <Route index element={<Navigate to="overview" replace />} />
                                <Route path="overview" element={<ProjectOverview />} />
                                <Route path="members" element={<ProjectMembers />} />
                                <Route path="tasks" element={<ProjectTasks />} />
                                <Route path="calendar" element={<ProjectDetails />} />
                                <Route path="files" element={<ProjectDetails />} />
                                <Route path="settings" element={<ProjectSettingsPage />} />
                            </Route>
                            <Route path="/workspace/invite" element={<WorkspaceInviteAccept />} />
                        </>
                    )}
                    <Route path='/auth/login' element={user ? <Navigate to="/dashboard" replace /> : <Home />} />
                    <Route path='/auth/signup' element={user ? <Navigate to="/dashboard" replace /> : <Home />} />
                    <Route path='/auth/forgot-password' element={user ? <Navigate to="/dashboard" replace /> : <Home />} />
                    <Route path='/auth/set-password' element={user ? <Navigate to="/dashboard" replace /> : <Home />} />
                    <Route path='/auth/verify' element={user ? <Navigate to="/dashboard" replace /> : <Home />} />
                    <Route path='/auth/reset-password' element={user ? <Navigate to="/dashboard" replace /> : <Home />} />
                    <Route path='/auth/verify' element={user ? <Navigate to="/dashboard" replace /> : <Home />} />
                </Route>

            </Routes>
        </Router>
    )
}

function App() {
    return (
        <AuthProvider>
            <AppProvider />
        </AuthProvider>
    )
}

export default App;