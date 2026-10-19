import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Main from './pages/Main'
import Demo from './pages/Demo'

function App() {
    return (
        <BrowserRouter>
            <div className="app-shell">
                <Routes>
                    <Route path="/" element={<Main />} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default App