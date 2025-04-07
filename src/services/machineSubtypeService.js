import { getAuthHeader } from './authService';

const API_URL = 'http://localhost:3000/api/machine-subtypes';

const getHeaders = () => ({
    'Content-Type': 'application/json',
    ...getAuthHeader()
});

export const fetchMachineSubtypes = async () => {
    const response = await fetch(API_URL, {
        headers: getHeaders()
    });
    if (!response.ok) {
        throw new Error('Failed to fetch machine subtypes');
    }
    return response.json();
};

export const createMachineSubtype = async (machineSubtype) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(machineSubtype),
    });
    if (!response.ok) {
        throw new Error('Failed to create machine subtype');
    }
    return response.json();
};

export const updateMachineSubtype = async (id, machineSubtype) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(machineSubtype),
    });
    if (!response.ok) {
        throw new Error('Failed to update machine subtype');
    }
    return response.json();
};

export const deleteMachineSubtype = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    if (!response.ok) {
        throw new Error('Failed to delete machine subtype');
    }
}; 