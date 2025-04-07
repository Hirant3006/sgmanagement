import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Page,
    Layout,
    Card,
    Button,
    Frame,
    Banner,
    DataTable,
    Text,
    Image,
} from '@shopify/polaris';
import logo from '../assets/logo.jpg';

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [inventory, setInventory] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/inventory`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setInventory(data);
            } catch (error) {
                setError('Lỗi khi tải dữ liệu kho');
                console.error('Error fetching inventory:', error);
            }
        };

        fetchInventory();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const rows = inventory.map((item) => [
        item.name,
        item.quantity,
    ]);

    return (
        <Frame>
            <Page
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Image
                            source={logo}
                            alt="Xe Nước Mía Tuấn"
                            width="100px"
                        />
                        <Text variant="heading2xl" as="h1">
                            Xe Nước Mía Tuấn
                        </Text>
                    </div>
                }
                primaryAction={<Button onClick={handleLogout}>Đăng xuất</Button>}
            >
                <Layout>
                    <Layout.Section>
                        <Card sectioned>
                            <Text variant="headingMd" as="h2">
                                Chào mừng, {user?.username}
                            </Text>
                        </Card>
                    </Layout.Section>

                    <Layout.Section>
                        {error && (
                            <Banner status="critical">
                                <p>{error}</p>
                            </Banner>
                        )}
                        <Card>
                            <DataTable
                                columnContentTypes={['text', 'numeric']}
                                headings={['Tên sản phẩm', 'Số lượng']}
                                rows={rows}
                            />
                        </Card>
                    </Layout.Section>
                </Layout>
            </Page>
        </Frame>
    );
};

export default Dashboard; 