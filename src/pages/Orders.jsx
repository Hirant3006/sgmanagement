import { Box, Paper, Typography } from '@mui/material';

const Orders = () => {
    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Đơn hàng
            </Typography>
            <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Danh sách đơn hàng
                </Typography>
                {/* Add your orders content here */}
            </Paper>
        </Box>
    );
};

export default Orders; 