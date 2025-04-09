const API_URL = import.meta.env.VITE_API_URL + '/auth';
console.log('Auth API URL:', API_URL);

export const login = async (credentials) => {
    console.log('Login attempt with credentials:', credentials);
    console.log('Login API URL:', `${API_URL}/login`);
    
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (!response.ok) {
        throw new Error('Đăng nhập thất bại');
    }
    const data = await response.json();
    // Store the token in localStorage
    localStorage.setItem('token', data.token);
    // Store the user data in localStorage
    if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
    }
    console.log('Login successful, token stored:', data.token);
    return data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getCurrentUser = () => {
    const userData = localStorage.getItem('user');
    if (!userData) return null;
    
    try {
        return JSON.parse(userData);
    } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
    }
};

export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    console.log('Checking authentication, token:', token);
    return !!token;
};

export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    console.log('Getting auth header, token:', token);
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Temporary function to update the token
export const updateToken = (newToken) => {
    localStorage.setItem('token', newToken);
    console.log('Token updated in localStorage:', newToken);
}; 