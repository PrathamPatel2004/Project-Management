import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Home from './pages/Home';
import Layout from './pages/Layout';
import Projects from './pages/Projects';
import Dashboard from './pages/Dashboard';
import Team from './pages/Team';
import Settings from './pages/Settings';
import ProjectDetails from './pages/ProjectDetails';

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
                    <Route index element={user ? <Dashboard /> : <Home />} />
                    {user && (
                        <>
                            <Route path='projects' element={<Projects />} />
                            <Route path='team' element={<Team />} />
                            <Route path='settings' element={<Settings />} />
                            <Route path='profile' element={<Dashboard />} />
                            <Route path='projectsDetail' element={<ProjectDetails />} />
                        </>
                    )}
                    <Route path='/auth/login' element={user ? <Dashboard /> : <Home />} />
                    <Route path='/auth/signup' element={user ? <Dashboard /> : <Home />} />
                    <Route path='/auth/forgot-password' element={user ? <Dashboard /> : <Home />} />
                    <Route path='/auth/set-password' element={user ? <Dashboard /> : <Home />} />
                    <Route path='/auth/verify' element={user ? <Dashboard /> : <Home />} />
                    <Route path='/auth/reset-password' element={user ? <Dashboard /> : <Home />} />
                    <Route path='/auth/verify' element={user ? <Dashboard /> : <Home />} />
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