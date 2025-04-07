import config from '../config';

const API_URL = config.apiUrl;

const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(error.message || 'An error occurred');
    }
    return response.json();
};

const api = {
    // Orders
    getOrders: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/orders?${queryString}`);
        return handleResponse(response);
    },

    createOrder: async (data) => {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    updateOrder: async (id, data) => {
        const response = await fetch(`${API_URL}/orders/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    deleteOrder: async (id) => {
        const response = await fetch(`${API_URL}/orders/${id}`, {
            method: 'DELETE'
        });
        return handleResponse(response);
    },

    // Machines
    getMachines: async () => {
        const response = await fetch(`${API_URL}/machines`);
        return handleResponse(response);
    },

    // Machine Types
    getMachineTypes: async () => {
        const response = await fetch(`${API_URL}/machine-types`);
        return handleResponse(response);
    },

    // Machine Subtypes
    getMachineSubtypes: async () => {
        const response = await fetch(`${API_URL}/machine-subtypes`);
        return handleResponse(response);
    },

    // Auth
    login: async (credentials) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        return handleResponse(response);
    }
};

export default api; 