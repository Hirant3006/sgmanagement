import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Page,
    Layout,
    Card,
    FormLayout,
    TextField,
    Button,
    Banner,
    Frame,
    Text,
    Image,
} from '@shopify/polaris';
import logo from '../assets/logo.jpg';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Mật khẩu không khớp');
            return;
        }

        try {
            await register(username, password);
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Frame>
            <Page narrowWidth>
                <Layout>
                    <Layout.Section>
                        <Card sectioned>
                            <FormLayout>
                                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                    <Image
                                        source={logo}
                                        alt="Xe Nước Mía Tuấn"
                                        width="200px"
                                    />
                                </div>
                                <Text variant="headingLg" as="h2" alignment="center">
                                    Tạo tài khoản mới
                                </Text>
                                {error && (
                                    <Banner status="critical">
                                        <p>{error}</p>
                                    </Banner>
                                )}
                                <TextField
                                    label="Tên đăng nhập"
                                    value={username}
                                    onChange={setUsername}
                                    autoComplete="username"
                                />
                                <TextField
                                    type="password"
                                    label="Mật khẩu"
                                    value={password}
                                    onChange={setPassword}
                                    autoComplete="new-password"
                                />
                                <TextField
                                    type="password"
                                    label="Xác nhận mật khẩu"
                                    value={confirmPassword}
                                    onChange={setConfirmPassword}
                                    autoComplete="new-password"
                                />
                                <Button primary onClick={handleSubmit}>
                                    Đăng ký
                                </Button>
                            </FormLayout>
                        </Card>
                    </Layout.Section>
                </Layout>
            </Page>
        </Frame>
    );
};

export default Register; 