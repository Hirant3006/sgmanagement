import { Box, Paper, Typography } from '@mui/material';

const Dashboard = () => {
    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Trang chủ
            </Typography>
            <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Bảng điều khiển
                </Typography>
                {/* Add your dashboard content here */}
            </Paper>
        </Box>
    );
};

export default Dashboard; 