import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    styled,
    Divider,
} from '@mui/material';
import {
    Home as HomeIcon,
    ShoppingCart as OrdersIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpg';

const drawerWidth = 240;

const StyledDrawer = styled(Drawer)({
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
        width: drawerWidth,
        boxSizing: 'border-box',
        backgroundColor: '#fff',
        borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        display: 'flex',
        flexDirection: 'column',
    },
});

const LogoContainer = styled(Box)({
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
});

const Logo = styled('img')({
    width: '40px',
    height: '40px',
    borderRadius: '50%',
});

const StyledListItemButton = styled(ListItemButton)(({ selected }) => ({
    margin: '4px 8px',
    borderRadius: '8px',
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
    ...(selected && {
        backgroundColor: 'rgba(0, 0, 0, 0.08) !important',
    }),
}));

const StyledListItemIcon = styled(ListItemIcon)({
    minWidth: '48px',
    color: 'rgba(0, 0, 0, 0.87)',
});

const Sidebar = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const navigationItems = [
        {
            label: 'Trang chủ',
            icon: <HomeIcon />,
            url: '/dashboard',
        },
        {
            label: 'Đơn hàng',
            icon: <OrdersIcon />,
            url: '/orders',
        },
        {
            label: 'Loại máy',
            icon: <SettingsIcon />,
            url: '/machine-types',
        },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <StyledDrawer variant="permanent">
                <LogoContainer>
                    <Logo src={logo} alt="Logo" onClick={() => navigate('/dashboard')} />
                </LogoContainer>
                <List sx={{ pt: 1, flex: 1 }}>
                    {navigationItems.map((item) => (
                        <ListItem key={item.url} disablePadding>
                            <StyledListItemButton
                                selected={location.pathname === item.url}
                                onClick={() => navigate(item.url)}
                            >
                                <StyledListItemIcon>
                                    {item.icon}
                                </StyledListItemIcon>
                                <ListItemText 
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        style: { fontWeight: location.pathname === item.url ? 600 : 400 }
                                    }}
                                />
                            </StyledListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    <ListItem disablePadding>
                        <StyledListItemButton onClick={handleLogout}>
                            <StyledListItemIcon>
                                <LogoutIcon />
                            </StyledListItemIcon>
                            <ListItemText primary="Đăng xuất" />
                        </StyledListItemButton>
                    </ListItem>
                </List>
            </StyledDrawer>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: `calc(100% - ${drawerWidth}px)`,
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default Sidebar; 