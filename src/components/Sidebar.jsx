import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import {
    HomeOutlined,
    ShoppingCartOutlined,
    SettingOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import styled from '@emotion/styled';
import logo from '../assets/logo.jpg';
import { useState } from 'react';

const { Sider } = Layout;

const Logo = styled('img')({
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    cursor: 'pointer',
});

const LogoContainer = styled('div')({
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
});

const ToggleButton = styled(Button)({
    position: 'absolute',
    top: '16px',
    right: '-16px',
    zIndex: 1,
    borderRadius: '0 4px 4px 0',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
});

const Sidebar = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const [collapsed, setCollapsed] = useState(false);

    const menuItems = [
        {
            key: '/dashboard',
            icon: <HomeOutlined />,
            label: 'Trang chủ',
        },
        {
            key: '/orders',
            icon: <ShoppingCartOutlined />,
            label: 'Đơn hàng',
        },
        {
            key: '/machine-types',
            icon: <SettingOutlined />,
            label: 'Loại máy',
        },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                width={240}
                theme="light"
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                trigger={null}
                style={{
                    borderRight: '1px solid rgba(0, 0, 0, 0.06)',
                    position: 'relative',
                }}
            >
                <ToggleButton 
                    type="text" 
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} 
                    onClick={toggleSidebar}
                />
                <LogoContainer>
                    <Logo src={logo} alt="Logo" onClick={() => navigate('/dashboard')} />
                </LogoContainer>
                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    style={{ borderRight: 0 }}
                    items={[
                        ...menuItems,
                        {
                            key: 'logout',
                            icon: <LogoutOutlined />,
                            label: 'Đăng xuất',
                            onClick: handleLogout,
                            style: { marginTop: 'auto' },
                        },
                    ]}
                    onClick={({ key }) => {
                        if (key !== 'logout') {
                            navigate(key);
                        }
                    }}
                />
            </Sider>
            <Layout style={{ padding: '24px' }}>
                {children}
            </Layout>
        </Layout>
    );
};

export default Sidebar; 