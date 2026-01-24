import { useState } from 'react'
import './App.css'
import { AuthProvider } from './contexts/AuthContext'

function App() {

    return (
        <AuthProvider>
            <div className="App">
                <h1>Welcome to the App</h1>
            </div>
        </AuthProvider>
    )
}

export default App
