import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentWorkspace } from '../features/workspaceSlice'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CheckIcon from '@mui/icons-material/Check'
import AddIcon from '@mui/icons-material/Add'

import CreateWorkspaceModal from './CreateWorkspaceModal'

function WorkspaceDropdown() {

    const { workspaces = [], currentWorkspace = null, loading } =
        useSelector((state) => state.workspace || {})

    const [isOpen, setIsOpen] = useState(false)
    const [showCreateModal, setShowCreateModal] = useState(false)

    const dropdownRef = useRef(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onSelectWorkspace = (workspaceId) => {
        dispatch(setCurrentWorkspace(workspaceId))
        setIsOpen(false)
        navigate('/')
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <>
            <div className="relative m-4" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(prev => !prev)}
                    className="w-full flex items-center justify-between p-3 rounded hover:bg-gray-100 dark:hover:bg-neutral-800"
                >
                    <div className="flex items-center gap-3">
                        <img
                            src={currentWorkspace?.image_url || "/no-image.png"}
                            alt=""
                            className="w-8 h-8 rounded"
                        />
                        <div className="text-left min-w-0">
                            <p className="font-semibold text-sm truncate">
                                {currentWorkspace?.name || "Select Workspace"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-neutral-400">
                                {workspaces.length} workspace{workspaces.length !== 1 ? "s" : ""}
                            </p>
                        </div>
                    </div>
                    <ExpandMoreIcon fontSize="small" />
                </button>

                {/* Dropdown */}
                {isOpen && (
                    <div className="absolute z-50 w-64 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded shadow top-full left-0">

                        <div className="p-2">
                            <p className="text-xs text-gray-500 dark:text-neutral-400 uppercase tracking-wide mb-2 px-2">
                                Workspaces
                            </p>

                            {loading && (
                                <p className="text-xs px-2 py-1 text-gray-400">Loading...</p>
                            )}

                            {!loading && workspaces.length == 0 ? (
                                <div className="min-h-8 max-h-16 flex items-center gap-3 p-2 rounded">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm truncate">No Workspaces</p>
                                    </div>
                                </div>
                            ) : (
                                workspaces.map((ws) => (
                                    <div
                                        key={ws.id}
                                        onClick={() => onSelectWorkspace(ws.id)}
                                        className="min-h-8 max-h-16 flex items-center gap-3 p-2 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-neutral-800"
                                    >
                                        <img src={ws.image_url} className="w-6 h-6 rounded" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm truncate">{ws.name}</p>
                                        </div>
                                        {currentWorkspace?.id === ws.id && (
                                            <CheckIcon fontSize="small" />
                                        )}
                                    </div>
                                ))   
                            )}
                        </div>

                        <hr className="border-gray-200 dark:border-neutral-700" />

                        <button
                            onClick={() => {
                                setIsOpen(false)
                                setShowCreateModal(true)
                            }}
                            className="w-full text-left px-3 py-2 text-xs text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-neutral-800 flex items-center gap-2"
                        >
                            <AddIcon fontSize="small" />
                            Create Workspace
                        </button>
                    </div>
                )}
            </div>

            {showCreateModal && (
                <CreateWorkspaceModal onClose={() => setShowCreateModal(false)} />
            )}
        </>
    )
}

export default WorkspaceDropdown;