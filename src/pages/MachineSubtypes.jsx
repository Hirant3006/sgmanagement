import { useState, useEffect } from 'react';
import { 
    Layout,
    Typography,
    Button,
    Modal,
    Input,
    Space,
    Tooltip,
    Card
} from 'antd';
import { 
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { fetchMachineSubtypes, deleteMachineSubtype, getHeaders } from '../services/machineSubtypeService';
import { useAuth } from '../context/AuthContext';
import { updateToken } from '../services/authService';
import ResizableTable from '../components/ResizableTable';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Content } = Layout;

const API_URL = import.meta.env.VITE_API_URL;

const MachineSubtypes = () => {
    const [machineSubtypes, setMachineSubtypes] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
    });
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    // Update token in localStorage
    useEffect(() => {
        // This is a temporary fix to update the token
        const newToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0NDE2OTI3NywiZXhwIjoxNzQ0MjU1Njc3fQ.VRR4DHVTpbnwBTuWVlgzs9wRiDaqhWFZ6MGE1p1G850';
        updateToken(newToken);
    }, []);

    // Fetch machine subtypes data
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Authentication status:', isAuthenticated);
                console.log('Current user:', user);
                console.log('Token:', localStorage.getItem('token'));
                console.log('Environment:', import.meta.env.VITE_APP_ENV);
                console.log('API URL:', import.meta.env.VITE_API_URL);
                
                if (!isAuthenticated) {
                    console.log('User is not authenticated, redirecting to login');
                    navigate('/login');
                    return;
                }
                
                // Check if token exists in localStorage
                const token = localStorage.getItem('token');
                if (!token) {
                    console.log('No token found in localStorage, redirecting to login');
                    navigate('/login');
                    return;
                }
                
                const data = await fetchMachineSubtypes();
                setMachineSubtypes(data);
            } catch (error) {
                console.error('Error fetching machine subtypes:', error);
                if (error.message.includes('401')) {
                    navigate('/login');
                }
            }
        };

        fetchData();
        setSearchText('');
    }, [navigate, isAuthenticated, user]);

    // Filter data based on search text
    const getFilteredData = () => {
        if (!searchText) return machineSubtypes;
        
        return machineSubtypes.filter(item => 
            item.name.toLowerCase().includes(searchText.toLowerCase())
        );
    };

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const handleAdd = () => {
        setEditMode(false);
        setFormData({ name: '' });
        setModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditMode(true);
        setFormData({ name: record.name });
        setModalVisible(true);
    };

    const handleCancel = () => {
        setModalVisible(false);
        setFormData({ name: '' });
        setEditMode(false);
    };

    const handleSubmit = async () => {
        try {
            const endpoint = 'machine-subtypes';
            
            const response = await fetch(`${API_URL}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // Refresh data
                const fetchResponse = await fetch(`${API_URL}/${endpoint}`);
                const data = await fetchResponse.json();
                setMachineSubtypes(data);
                handleCancel();
            }
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            // Check if the machine subtype is referenced by any machines
            const response = await fetch(`${API_URL}/machines?subtype_id=${id}`, {
                headers: getHeaders()
            });
            
            if (!response.ok) {
                throw new Error('Failed to check machine references');
            }
            
            const machines = await response.json();
            
            if (machines.length > 0) {
                // Show a warning message
                Modal.warning({
                    title: 'Cannot Delete Machine Subtype',
                    content: `This machine subtype is used by ${machines.length} machine(s). Please remove or update these machines before deleting the subtype.`,
                    okText: 'OK'
                });
                return;
            }
            
            // If no machines reference this subtype, proceed with deletion
            Modal.confirm({
                title: 'Are you sure you want to delete this machine subtype?',
                content: 'This action cannot be undone.',
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk: async () => {
                    try {
                        await deleteMachineSubtype(id);
                        // Refresh the data
                        const data = await fetchMachineSubtypes();
                        setMachineSubtypes(data);
                    } catch (error) {
                        console.error('Error deleting data:', error);
                        Modal.error({
                            title: 'Error',
                            content: 'Failed to delete machine subtype. It may be referenced by other records.'
                        });
                    }
                }
            });
        } catch (error) {
            console.error('Error checking machine references:', error);
            Modal.error({
                title: 'Error',
                content: 'Failed to check machine references.'
            });
        }
    };

    const columns = [
        { 
            title: 'Mã',
            dataIndex: 'id',
            key: 'id',
            width: 70
        },
        { 
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            width: 300,
            ellipsis: true
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 150,
            fixed: 'right',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Sửa">
                        <Button 
                            type="text" 
                            icon={<EditOutlined />} 
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button 
                            type="text" 
                            danger 
                            icon={<DeleteOutlined />} 
                            onClick={() => handleDelete(record.id)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Layout>
                <Card>
                    <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleAdd}
                        >
                            Thêm phân loại máy
                        </Button>
                    </div>

                    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Input
                            placeholder="Tìm kiếm..."
                            value={searchText}
                            onChange={(e) => handleSearch(e.target.value)}
                            prefix={<SearchOutlined />}
                            style={{ width: 300 }}
                        />
                    </div>

                    <ResizableTable
                        dataSource={getFilteredData()}
                        columns={columns}
                        rowKey="id"
                        pagination={{ pageSize: 5 }}
                        scroll={{ x: 500 }}
                        locale={{
                            emptyText: 'Không có dữ liệu'
                        }}
                    />
                </Card>

                <Modal
                    title={editMode ? 'Sửa thông tin' : 'Thêm mới'}
                    open={modalVisible}
                    onOk={handleSubmit}
                    onCancel={handleCancel}
                    okText={editMode ? 'Cập nhật' : 'Thêm'}
                    cancelText="Hủy"
                >
                    <Input
                        autoFocus
                        placeholder="Tên"
                        value={formData.name}
                        onChange={(e) => setFormData({ name: e.target.value })}
                    />
                </Modal>
        </Layout>
    );
};

export default MachineSubtypes; 