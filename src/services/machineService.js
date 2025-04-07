import { getAuthHeader } from './authService';

const API_URL = 'http://localhost:3000/api/machines';

const getHeaders = () => ({
    'Content-Type': 'application/json',
    ...getAuthHeader()
});

export const fetchMachines = async () => {
    const response = await fetch(API_URL, {
        headers: getHeaders()
    });
    if (!response.ok) {
        throw new Error('Failed to fetch machines');
    }
    return response.json();
};

export const createMachine = async (machine) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(machine),
    });
    if (!response.ok) {
        throw new Error('Failed to create machine');
    }
    return response.json();
};

export const updateMachine = async (id, machine) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(machine),
    });
    if (!response.ok) {
        throw new Error('Failed to update machine');
    }
    return response.json();
};

export const deleteMachine = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    if (!response.ok) {
        throw new Error('Failed to delete machine');
    }
}; 