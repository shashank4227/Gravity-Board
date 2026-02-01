import React from 'react';
import { Routes, Route } from 'react-router-dom';
import GravityBoard from './components/GravityBoard';
import Sidebar from './components/Sidebar';
import CreateTaskForm from './components/CreateTaskForm';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { TaskProvider } from './context/TaskContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
        <TaskProvider>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                <Route element={<ProtectedRoute />}>
                    <Route path="/*" element={
                        <div className="flex min-h-screen bg-midnight text-t-primary">
                            <Sidebar />
                            <GravityBoard />
                            <CreateTaskForm />
                        </div>
                    } />
                </Route>
            </Routes>
        </TaskProvider>
    </AuthProvider>
  );
}

export default App;
