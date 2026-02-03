import React from 'react';
import { Routes, Route } from 'react-router-dom';
import GravityBoard from './components/GravityBoard';
import Sidebar from './components/Sidebar';
import CreateTaskForm from './components/CreateTaskForm';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { TaskProvider, useTaskContext } from './context/TaskContext';
import { AuthProvider } from './context/AuthContext';
import useTaskNotifications from './hooks/useTaskNotifications';

// Inner component to access context
const AppContent = () => {
    const { tasks } = useTaskContext();
    // Notifications handled in TaskContext

    return (
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
    );
};

function App() {
  return (
    <AuthProvider>
        <TaskProvider>
            <AppContent />
        </TaskProvider>
    </AuthProvider>
  );
}

export default App;
