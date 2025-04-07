import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Layout, Card, Input, Button, Typography, Alert, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import logo from '../assets/logo.jpg';

const { Content } = Layout;
const { Title } = Typography;

const Logo = styled('img')({
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    marginBottom: '20px',
});

const StyledCard = styled(Card)({
    maxWidth: '400px',
    width: '100%',
    padding: '24px',
});

const StyledContent = styled(Content)({
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '24px',
    background: '#f0f2f5',
});

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await login(username, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && username && password) {
            handleSubmit(e);
        }
    };

    return (
        <Layout>
            <StyledContent>
                <StyledCard>
                    <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
                        <Logo src={logo} alt="Xe Nước Mía Tuấn" />
                        <Title level={3}>
                            Đăng nhập vào tài khoản
                        </Title>
                        {error && (
                            <Alert
                                message={error}
                                type="error"
                                showIcon
                            />
                        )}
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Input
                                size="large"
                                placeholder="Tên đăng nhập"
                                prefix={<UserOutlined />}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onKeyPress={handleKeyPress}
                                autoFocus
                            />
                            <Input.Password
                                size="large"
                                placeholder="Mật khẩu"
                                prefix={<LockOutlined />}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <Button
                                type="primary"
                                size="large"
                                onClick={handleSubmit}
                                block
                            >
                                Đăng nhập
                            </Button>
                        </Space>
                    </Space>
                </StyledCard>
            </StyledContent>
        </Layout>
    );
};

export default Login; 