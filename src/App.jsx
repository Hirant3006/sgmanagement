import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import MachineTypes from './pages/MachineTypes';
import { useEffect } from 'react';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
    },
});

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    return isAuthenticated ? children : null;
};

const App = () => {
    return (
        <AuthProvider>
            <ThemeProvider theme={theme}>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute>
                                    <Sidebar>
                                        <Dashboard />
                                    </Sidebar>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/orders"
                            element={
                                <PrivateRoute>
                                    <Sidebar>
                                        <Orders />
                                    </Sidebar>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/machine-types"
                            element={
                                <PrivateRoute>
                                    <Sidebar>
                                        <MachineTypes />
                                    </Sidebar>
                                </PrivateRoute>
                            }
                        />
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                    </Routes>
                </Router>
            </ThemeProvider>
        </AuthProvider>
    );
};

export default App;