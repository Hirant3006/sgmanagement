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
import { fetchMachineSubtypes } from '../services/machineSubtypeService';
import ResizableTable from '../components/ResizableTable';

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

    // Fetch machine subtypes data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchMachineSubtypes();
                setMachineSubtypes(data);
            } catch (error) {
                console.error('Error fetching machine subtypes:', error);
            }
        };

        fetchData();
        setSearchText('');
    }, []);

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
        if (window.confirm('Bạn có chắc chắn muốn xóa mục này?')) {
            try {
                const endpoint = 'machine-subtypes';
                const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    // Refresh data
                    const fetchResponse = await fetch(`${API_URL}/${endpoint}`);
                    const data = await fetchResponse.json();
                    setMachineSubtypes(data);
                }
            } catch (error) {
                console.error('Error deleting data:', error);
            }
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