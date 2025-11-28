import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserDetails from './pages/UserDetails';
import TutorDashboard from './pages/TutorDashboard';
import StudentDashboard from './pages/StudentDashboard';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admin/user/:id" element={<UserDetails />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={['tutor']} />}>
                        <Route path="/tutor" element={<TutorDashboard />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                        <Route path="/student" element={<StudentDashboard />} />
                    </Route>

                    <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
