import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import LoginFailed from './pages/LoginFailed.tsx'
import Landing from './pages/Landing.tsx'
import Home from './pages/Home.tsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login-failed" element={<LoginFailed />} />
      <Route path="/home" element={<Home />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App