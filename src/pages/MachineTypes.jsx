import { Box, Paper, Typography } from '@mui/material';

const MachineTypes = () => {
    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Loại máy
            </Typography>
            <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Danh sách loại máy
                </Typography>
                {/* Add your machine types content here */}
            </Paper>
        </Box>
    );
};

export default MachineTypes; 