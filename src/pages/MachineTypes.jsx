import { useState, useEffect } from 'react';
import { 
    Layout,
    Typography,
    Tabs,
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
    ToolOutlined,
    AppstoreOutlined,
    SettingOutlined,
    RobotOutlined
} from '@ant-design/icons';
import { fetchMachines } from '../services/machineService';
import { fetchMachineTypes } from '../services/machineTypeService';
import { fetchMachineSubtypes } from '../services/machineSubtypeService';
import ResizableTable from '../components/ResizableTable';

const { Title } = Typography;
const { Content } = Layout;

const MachineTypes = () => {
    const [currentTab, setCurrentTab] = useState('0');
    const [machines, setMachines] = useState([]);
    const [machineTypes, setMachineTypes] = useState([]);
    const [machineSubtypes, setMachineSubtypes] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [formData, setFormData] = useState({ name: '' });
    const [editMode, setEditMode] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchText, setSearchText] = useState('');

    // Fetch data based on current tab
    useEffect(() => {
        const fetchData = async () => {
            try {
                let data;
                if (currentTab === '0') {
                    data = await fetchMachines();
                    setMachines(data);
                } else if (currentTab === '1') {
                    data = await fetchMachineTypes();
                    setMachineTypes(data);
                } else {
                    data = await fetchMachineSubtypes();
                    setMachineSubtypes(data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
        setSearchText('');
    }, [currentTab]);

    const handleTabChange = (key) => {
        setCurrentTab(key);
    };

    // Filter data based on search text
    const getFilteredData = () => {
        const data = currentTab === '0' ? machines : 
                    currentTab === '1' ? machineTypes : 
                    machineSubtypes;
        
        if (!searchText) return data;
        
        return data.filter(item => 
            item.name.toLowerCase().includes(searchText.toLowerCase())
        );
    };

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const showModal = (item = null) => {
        if (item) {
            setEditMode(true);
            setSelectedItem(item);
            setFormData({ name: item.name });
        } else {
            setEditMode(false);
            setSelectedItem(null);
            setFormData({ name: '' });
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setFormData({ name: '' });
        setEditMode(false);
        setSelectedItem(null);
    };

    const handleSubmit = async () => {
        try {
            const endpoint = currentTab === '0' ? 'machines' : 
                           currentTab === '1' ? 'machine-types' : 
                           'machine-subtypes';
            const url = `http://localhost:3000/api/${endpoint}${editMode ? `/${selectedItem.id}` : ''}`;
            const method = editMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // Refresh data
                const fetchResponse = await fetch(`http://localhost:3000/api/${endpoint}`);
                const data = await fetchResponse.json();
                
                if (currentTab === '0') setMachines(data);
                else if (currentTab === '1') setMachineTypes(data);
                else setMachineSubtypes(data);
                
                handleCancel();
            }
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa mục này?')) {
            try {
                const endpoint = currentTab === '0' ? 'machines' : 
                               currentTab === '1' ? 'machine-types' : 
                               'machine-subtypes';
                const response = await fetch(`http://localhost:3000/api/${endpoint}/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    // Refresh data
                    const fetchResponse = await fetch(`http://localhost:3000/api/${endpoint}`);
                    const data = await fetchResponse.json();
                    
                    if (currentTab === '0') setMachines(data);
                    else if (currentTab === '1') setMachineTypes(data);
                    else setMachineSubtypes(data);
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
                            onClick={() => showModal(record)}
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

    const items = [
        {
            key: '0',
            label: (
                <span>
                    <ToolOutlined />
                    <span style={{ marginLeft: 8 }}>Danh sách máy</span>
                </span>
            ),
            children: (
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
            ),
        },
        {
            key: '1',
            label: (
                <span>
                    <AppstoreOutlined />
                    <span style={{ marginLeft: 8 }}>Loại máy</span>
                </span>
            ),
            children: (
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
            ),
        },
        {
            key: '2',
            label: (
                <span>
                    <SettingOutlined />
                    <span style={{ marginLeft: 8 }}>Phân loại máy</span>
                </span>
            ),
            children: (
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
            ),
        },
    ];

    return (
        <Layout>
            <Content style={{ padding: '24px' }}>
                <Card>
                    <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <ToolOutlined style={{ fontSize: 24, marginRight: 8 }} />
                            <h1 style={{ margin: 0 }}>Quản lý máy móc</h1>
                        </div>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                setEditMode(false);
                                setSelectedItem(null);
                                setFormData({ name: '' });
                                setIsModalVisible(true);
                            }}
                        >
                            Thêm máy móc
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

                    <Tabs
                        activeKey={currentTab}
                        onChange={handleTabChange}
                        items={items}
                        type="card"
                    />
                </Card>

                <Modal
                    title={editMode ? 'Sửa thông tin' : 'Thêm mới'}
                    open={isModalVisible}
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
            </Content>
        </Layout>
    );
};

export default MachineTypes; 