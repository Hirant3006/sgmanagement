import { getAuthHeader } from './authService';

const API_URL = 'http://localhost:3000/api/machine-types';

const getHeaders = () => ({
    'Content-Type': 'application/json',
    ...getAuthHeader()
});

export const fetchMachineTypes = async () => {
    const response = await fetch(API_URL, {
        headers: getHeaders()
    });
    if (!response.ok) {
        throw new Error('Failed to fetch machine types');
    }
    return response.json();
};

export const createMachineType = async (machineType) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(machineType),
    });
    if (!response.ok) {
        throw new Error('Failed to create machine type');
    }
    return response.json();
};

export const updateMachineType = async (id, machineType) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(machineType),
    });
    if (!response.ok) {
        throw new Error('Failed to update machine type');
    }
    return response.json();
};

export const deleteMachineType = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    if (!response.ok) {
        throw new Error('Failed to delete machine type');
    }
}; 