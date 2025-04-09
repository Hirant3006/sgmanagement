import { getAuthHeader } from './authService';

// Use the environment variable directly
const API_URL = import.meta.env.VITE_API_URL + '/machine-subtypes';
console.log('API URL from environment:', import.meta.env.VITE_API_URL);
console.log('Full API URL for machine subtypes:', API_URL);
console.log('Environment:', import.meta.env.VITE_APP_ENV);

export const getHeaders = () => {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);
    
    const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeader()
    };
    
    console.log('Request headers:', headers);
    return headers;
};

export const fetchMachineSubtypes = async () => {
    console.log('Fetching machine subtypes from:', API_URL);
    console.log('Using headers:', getHeaders());
    
    const response = await fetch(API_URL, {
        headers: getHeaders()
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
        console.error('Failed to fetch machine subtypes:', response.status, response.statusText);
        throw new Error('Không thể tải danh sách phân loại máy');
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
        throw new Error('Không thể tạo phân loại máy mới');
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
        throw new Error('Không thể cập nhật phân loại máy');
    }
    return response.json();
};

export const deleteMachineSubtype = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    
    if (!response.ok) {
        throw new Error('Không thể xóa phân loại máy');
    }
    
    return response.json();
}; 