import React from 'react';
import GravityBoard from './components/GravityBoard';
import Sidebar from './components/Sidebar';
import CreateTaskForm from './components/CreateTaskForm';
import { TaskProvider } from './context/TaskContext';

function App() {
  return (
    <TaskProvider>
        <div className="flex min-h-screen bg-midnight text-t-primary">
            <Sidebar />
            <GravityBoard />
            <CreateTaskForm />
        </div>
    </TaskProvider>
  );
}

export default App;
