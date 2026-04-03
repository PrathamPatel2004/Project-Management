import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useDispatch, useSelector } from 'react-redux'

import { fetchWorkspaces } from '../features/workspaceSlice'
import { fetchProjects } from '../features/projectSlice'

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const { loading, user } = useAuth()
    const dispatch = useDispatch()
    const {
        workspaces,
        currentWorkspace,
        loading: wsLoading
    } = useSelector((state) => state.workspace)

    useEffect(() => {
        if (!loading && user) {
            dispatch(fetchWorkspaces())
        }
    }, [loading, user, dispatch])

    useEffect(() => {
        if (currentWorkspace?.id || currentWorkspace?._id) {
            const workspaceId = currentWorkspace.id || currentWorkspace._id
            dispatch(fetchProjects(workspaceId))
        }
    }, [currentWorkspace, dispatch])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-white dark:bg-neutral-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-white dark:bg-neutral-950 text-gray-900 dark:text-gray-100 overflow-hidden">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <Navbar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />
                {wsLoading && (
                    <div className="px-4 sm:px-6 lg:px-8 py-2 text-xs text-gray-500">
                        Loading workspaces...
                    </div>
                )}

                <main className="flex-1 overflow-y-auto">
                    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Layout