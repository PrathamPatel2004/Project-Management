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
        if (!loading && user && !workspaces.length) {
            dispatch(fetchWorkspaces())
        }
    }, [loading, user, workspaces.length, dispatch])

    useEffect(() => {
        if (currentWorkspace?.id || currentWorkspace?._id) {
            const workspaceId = currentWorkspace.id || currentWorkspace._id
            dispatch(fetchProjects(workspaceId))
        }
    }, [currentWorkspace, dispatch])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-white dark:bg-zinc-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 font-medium">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex bg-white dark:bg-neutral-950 text-gray-900 dark:text-gray-100">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />
            <div className="flex-1 flex flex-col h-screen">
                <Navbar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />
                {wsLoading && (
                    <div className="px-6 py-2 text-xs text-gray-500">
                        Loading workspaces...
                    </div>
                )}
                <div className="flex-1 h-full p-6 xl:p-10 xl:px-16 overflow-y-scroll">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Layout;