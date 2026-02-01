import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getTasks = async (params = {}) => {
    try {
        const response = await axios.get(`${API_URL}/tasks`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching tasks:", error);
        throw error;
    }
};

export const createTask = async (taskData) => {
    try {
        const response = await axios.post(`${API_URL}/tasks`, taskData);
        return response.data;
    } catch (error) {
        console.error("Error creating task:", error);
        throw error;
    }
};

export const updateTask = async (id, data) => {
    try {
        const response = await axios.patch(`${API_URL}/tasks/${id}/interactions`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating task:", error);
        throw error;
    }
};

export const startFocusSession = async (taskId, userEnergy) => {
    try {
        const response = await axios.post(`${API_URL}/focus/start`, { taskId, userEnergy });
        return response.data;
    } catch (error) {
        console.error("Error starting focus session:", error);
        throw error;
    }
};

export const completeFocusSession = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/focus/complete`, data);
        return response.data;
    } catch (error) {
        console.error("Error completing focus session:", error);
        throw error;
    }
};
