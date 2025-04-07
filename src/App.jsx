import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import MachineTypes from './pages/MachineTypes';
import { useEffect } from 'react';

const { defaultAlgorithm } = theme;

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
            <ConfigProvider
                theme={{
                    algorithm: defaultAlgorithm,
                    token: {
                        colorPrimary: '#1890ff',
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
                }}
            >
                <Router future={{ 
                    v7_relativeSplatPath: true,
                    v7_startTransition: true
                }}>
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
            </ConfigProvider>
        </AuthProvider>
    );
};

export default App;