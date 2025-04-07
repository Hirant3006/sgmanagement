import React, { useState, useEffect } from 'react';
import { Card, Layout, Button, Modal, Form, Input, DatePicker, InputNumber, Select, message, Table, Dropdown, Checkbox, Menu, Space, Collapse, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SettingOutlined, ShoppingCartOutlined, FilterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
// import ResizableTable from '../components/ResizableTable';

const { TextArea } = Input;
const { Content } = Layout;
const { Panel } = Collapse;
const { RangePicker } = DatePicker;

const API_URL = import.meta.env.VITE_API_URL;

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [filterForm] = Form.useForm();
    const [editingId, setEditingId] = useState(null);
    const [machines, setMachines] = useState([]);
    const [machineTypes, setMachineTypes] = useState([]);
    const [machineSubtypes, setMachineSubtypes] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [sortedInfo, setSortedInfo] = useState({
        columnKey: 'date',
        order: 'descend'
    });
    const [filters, setFilters] = useState({
        dateRange: [undefined,undefined],
        machineId: undefined,
        machineTypeId: undefined,
        machineSubtypeId: undefined,
        source: '',
        priceRange: undefined,
        costOfGoodRange: undefined,
        shippingCostRange: undefined,
        purchaseLocation: ''
    });
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [columnSettings, setColumnSettings] = useState(() => {
        // Try to load saved column settings from localStorage
        const savedSettings = localStorage.getItem('orderColumnSettings');
        if (savedSettings) {
            try {
                return JSON.parse(savedSettings);
            } catch (e) {
                console.error('Error parsing saved column settings:', e);
            }
        }
        // Default settings if nothing is saved
        return {
            date: true,
            machine_name: true,
            machine_type_name: true,
            machine_subtype_name: true,
            customer_name: true,
            phone: true,
            source: true,
            price: true,
            cost_of_good: true,
            shipping_cost: true,
            purchase_location: true,
            note: true,
            actions: true
        };
    });
    const [columnDropdownVisible, setColumnDropdownVisible] = useState(false);

    useEffect(() => {
        // Initialize filter form with current date range
        filterForm.setFieldsValue({
            dateRange: [dayjs(), dayjs()]
        });
        
        fetchOrders();
        fetchMachines();
        fetchMachineTypes();
        fetchMachineSubtypes();
    }, []);

    // Save column settings to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('orderColumnSettings', JSON.stringify(columnSettings));
    }, [columnSettings]);

    // Ensure orders are always sorted by date in descending order
    useEffect(() => {
        if (orders.length > 0) {
            const sortedData = [...orders].sort((a, b) => {
                return dayjs(b.date).valueOf() - dayjs(a.date).valueOf();
            });
            setOrders(sortedData);
        }
    }, [orders.length]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            // Build query parameters from filters
            const params = new URLSearchParams();
            
            // Date range
            if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
                params.append('dateFrom', filters.dateRange[0].format('YYYY-MM-DD'));
                params.append('dateTo', filters.dateRange[1].format('YYYY-MM-DD'));
            }
            
            // Machine
            if (filters.machineId) {
                params.append('machineId', filters.machineId);
            }
            
            // Machine Type
            if (filters.machineTypeId) {
                params.append('machineTypeId', filters.machineTypeId);
            }
            
            // Machine Subtype
            if (filters.machineSubtypeId) {
                params.append('machineSubtypeId', filters.machineSubtypeId);
            }
            
            // Source
            if (filters.source) {
                params.append('source', filters.source);
            }
            
            // Price range
            if (filters.priceRange && filters.priceRange[0] !== undefined) {
                params.append('priceMin', filters.priceRange[0]);
            }
            if (filters.priceRange && filters.priceRange[1] !== undefined) {
                params.append('priceMax', filters.priceRange[1]);
            }
            
            // Cost of good range
            if (filters.costOfGoodRange && filters.costOfGoodRange[0] !== undefined) {
                params.append('costOfGoodMin', filters.costOfGoodRange[0]);
            }
            if (filters.costOfGoodRange && filters.costOfGoodRange[1] !== undefined) {
                params.append('costOfGoodMax', filters.costOfGoodRange[1]);
            }
            
            // Shipping cost range
            if (filters.shippingCostRange && filters.shippingCostRange[0] !== undefined) {
                params.append('shippingCostMin', filters.shippingCostRange[0]);
            }
            if (filters.shippingCostRange && filters.shippingCostRange[1] !== undefined) {
                params.append('shippingCostMax', filters.shippingCostRange[1]);
            }
            
            // Purchase location
            if (filters.purchaseLocation) {
                params.append('purchaseLocation', filters.purchaseLocation);
            }
            
            const url = `${API_URL}/orders?${params.toString()}`;
            console.log('Fetching orders with URL:', url);
            console.log('Current filters state:', filters);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error('Error response:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorData
                });
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Orders data received:', {
                count: data.length,
                firstRecord: data[0],
                lastRecord: data[data.length - 1]
            });
            
            if (data.length === 0) {
                messageApi.info('Không tìm thấy đơn hàng nào phù hợp với bộ lọc');
            }
            
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            messageApi.error('Không thể tải danh sách đơn hàng: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchMachines = async () => {
        try {
            const response = await fetch(`${API_URL}/machines`);
            const data = await response.json();
            setMachines(data);
        } catch (error) {
            console.error('Error fetching machines:', error);
            messageApi.error('Không thể tải danh sách máy');
        }
    };

    const fetchMachineTypes = async () => {
        try {
            const response = await fetch(`${API_URL}/machine-types`);
            const data = await response.json();
            setMachineTypes(data);
        } catch (error) {
            console.error('Error fetching machine types:', error);
            messageApi.error('Không thể tải danh sách loại máy');
        }
    };

    const fetchMachineSubtypes = async () => {
        try {
            const response = await fetch(`${API_URL}/machine-subtypes`);
            const data = await response.json();
            setMachineSubtypes(data);
        } catch (error) {
            console.error('Error fetching machine subtypes:', error);
            messageApi.error('Không thể tải danh sách loại máy con');
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    const handleColumnVisibilityChange = (columnKey, checked) => {
        setColumnSettings(prev => {
            const newSettings = {
                ...prev,
                [columnKey]: checked
            };
            return newSettings;
        });
    };

    const handleDropdownVisibleChange = (visible) => {
        setColumnDropdownVisible(visible);
    };

    const menuItems = [
        {
            key: 'header',
            label: <strong>Hiển thị cột</strong>,
            disabled: true
        },
        {
            type: 'divider'
        },
        {
            key: 'date',
            label: (
                <Checkbox
                    checked={columnSettings.date}
                    onChange={(e) => handleColumnVisibilityChange('date', e.target.checked)}
                >
                    Ngày bán
                </Checkbox>
            )
        },
        {
            key: 'machine_name',
            label: (
                <Checkbox
                    checked={columnSettings.machine_name}
                    onChange={(e) => handleColumnVisibilityChange('machine_name', e.target.checked)}
                >
                    Máy
                </Checkbox>
            )
        },
        {
            key: 'machine_type_name',
            label: (
                <Checkbox
                    checked={columnSettings.machine_type_name}
                    onChange={(e) => handleColumnVisibilityChange('machine_type_name', e.target.checked)}
                >
                    Loại máy
                </Checkbox>
            )
        },
        {
            key: 'machine_subtype_name',
            label: (
                <Checkbox
                    checked={columnSettings.machine_subtype_name}
                    onChange={(e) => handleColumnVisibilityChange('machine_subtype_name', e.target.checked)}
                >
                    Phân loại máy
                </Checkbox>
            )
        },
        {
            key: 'customer_name',
            label: (
                <Checkbox
                    checked={columnSettings.customer_name}
                    onChange={(e) => handleColumnVisibilityChange('customer_name', e.target.checked)}
                >
                    Tên khách
                </Checkbox>
            )
        },
        {
            key: 'phone',
            label: (
                <Checkbox
                    checked={columnSettings.phone}
                    onChange={(e) => handleColumnVisibilityChange('phone', e.target.checked)}
                >
                    SĐT
                </Checkbox>
            )
        },
        {
            key: 'source',
            label: (
                <Checkbox
                    checked={columnSettings.source}
                    onChange={(e) => handleColumnVisibilityChange('source', e.target.checked)}
                >
                    Nguồn xe
                </Checkbox>
            )
        },
        {
            key: 'price',
            label: (
                <Checkbox
                    checked={columnSettings.price}
                    onChange={(e) => handleColumnVisibilityChange('price', e.target.checked)}
                >
                    Giá bán
                </Checkbox>
            )
        },
        {
            key: 'cost_of_good',
            label: (
                <Checkbox
                    checked={columnSettings.cost_of_good}
                    onChange={(e) => handleColumnVisibilityChange('cost_of_good', e.target.checked)}
                >
                    Giá nhập hàng
                </Checkbox>
            )
        },
        {
            key: 'shipping_cost',
            label: (
                <Checkbox
                    checked={columnSettings.shipping_cost}
                    onChange={(e) => handleColumnVisibilityChange('shipping_cost', e.target.checked)}
                >
                    Tiền vận chuyển
                </Checkbox>
            )
        },
        {
            key: 'purchase_location',
            label: (
                <Checkbox
                    checked={columnSettings.purchase_location}
                    onChange={(e) => handleColumnVisibilityChange('purchase_location', e.target.checked)}
                >
                    Nơi mua
                </Checkbox>
            )
        },
        {
            key: 'note',
            label: (
                <Checkbox
                    checked={columnSettings.note}
                    onChange={(e) => handleColumnVisibilityChange('note', e.target.checked)}
                >
                    Ghi chú
                </Checkbox>
            )
        }
    ];

    const columns = [
        {
            title: 'Ngày bán',
            dataIndex: 'date',
            key: 'date',
            width: 120,
            render: (text) => dayjs(text).format('DD/MM/YYYY'),
            sorter: {
                compare: (a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf(),
                multiple: 1
            },
            hidden: !columnSettings.date
        },
        {
            title: 'Máy',
            dataIndex: 'machine_name',
            key: 'machine_name',
            width: 150,
            hidden: !columnSettings.machine_name
        },
        {
            title: 'Loại máy',
            dataIndex: 'machine_type_name',
            key: 'machine_type_name',
            width: 150,
            hidden: !columnSettings.machine_type_name
        },
        {
            title: 'Phân loại máy',
            dataIndex: 'machine_subtype_name',
            key: 'machine_subtype_name',
            width: 150,
            hidden: !columnSettings.machine_subtype_name
        },
        {
            title: 'Tên khách',
            dataIndex: 'customer_name',
            key: 'customer_name',
            width: 150,
            hidden: !columnSettings.customer_name
        },
        {
            title: 'SĐT',
            dataIndex: 'phone',
            key: 'phone',
            width: 120,
            hidden: !columnSettings.phone
        },
        {
            title: 'Nguồn xe',
            dataIndex: 'source',
            key: 'source',
            width: 120,
            hidden: !columnSettings.source
        },
        {
            title: 'Giá bán',
            dataIndex: 'price',
            key: 'price',
            width: 150,
            render: (text) => formatCurrency(text),
            hidden: !columnSettings.price
        },
        {
            title: 'Giá nhập hàng',
            dataIndex: 'cost_of_good',
            key: 'cost_of_good',
            width: 150,
            render: (text) => formatCurrency(text),
            hidden: !columnSettings.cost_of_good
        },
        {
            title: 'Tiền vận chuyển',
            dataIndex: 'shipping_cost',
            key: 'shipping_cost',
            width: 150,
            render: (text) => text ? formatCurrency(text) : '-',
            hidden: !columnSettings.shipping_cost
        },
        {
            title: 'Nơi mua',
            dataIndex: 'purchase_location',
            key: 'purchase_location',
            width: 150,
            hidden: !columnSettings.purchase_location
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            key: 'note',
            width: 200,
            hidden: !columnSettings.note
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 100,
            fixed: 'right',
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => handleDelete(record.id)}
                    />
                </Space>
            ),
            hidden: !columnSettings.actions
        },
    ];

    // Filter out hidden columns
    const visibleColumns = columns.filter(column => !column.hidden);

    const handleEdit = (record) => {
        setEditingId(record.id);
        
        // Format the date to dayjs object
        const dateObj = dayjs(record.date);
        
        // Set form values
        form.setFieldsValue({
            date: dateObj,
            machine_id: record.machine_id,
            machine_type_id: record.machine_type_id,
            machine_subtype_id: record.machine_subtype_id,
            source: record.source,
            price: record.price,
            cost_of_good: record.cost_of_good,
            shipping_cost: record.shipping_cost,
            purchase_location: record.purchase_location,
            note: record.note
        });
        
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${API_URL}/orders/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                messageApi.success('Đơn hàng đã được xóa');
                fetchOrders();
            } else {
                messageApi.error('Không thể xóa đơn hàng');
            }
        } catch (error) {
            console.error('Error deleting order:', error);
            messageApi.error('Không thể xóa đơn hàng');
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            
            // Format the date to YYYY-MM-DD
            const formattedDate = values.date.format('YYYY-MM-DD');
            
            const orderData = {
                date: formattedDate,
                machine_id: values.machine_id,
                machine_type_id: values.machine_type_id,
                machine_subtype_id: values.machine_subtype_id,
                source: values.source,
                price: values.price,
                cost_of_good: values.cost_of_good,
                shipping_cost: values.shipping_cost,
                purchase_location: values.purchase_location,
                note: values.note
            };
            
            let url = `${API_URL}/orders`;
            let method = 'POST';
            
            if (editingId) {
                url = `${API_URL}/orders/${editingId}`;
                method = 'PUT';
            }
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });
            
            if (response.ok) {
                messageApi.success(editingId ? 'Đơn hàng đã được cập nhật' : 'Đơn hàng đã được tạo');
                setIsModalVisible(false);
                form.resetFields();
                setEditingId(null);
                fetchOrders();
            } else {
                const errorData = await response.json();
                messageApi.error(errorData.error || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Error saving order:', error);
            messageApi.error('Không thể lưu đơn hàng');
        }
    };

    const handleTableChange = (pagination, filters, sorter) => {
        console.log('Table changed:', { pagination, filters, sorter });

        // If the user changes the sorting, update the sortedInfo state
        if (sorter.column) {
            setSortedInfo(sorter);
        } else {
            // If no sorting is selected, default to date descending
            setSortedInfo({
                columnKey: 'date',
                order: 'descend'
            });
        }
    };

    const handleFilterChange = (changedValues) => {
        setFilters(prev => ({ ...prev, ...changedValues }));
    };

    const handleFilterSubmit = () => {
        fetchOrders();
    };

    const handleResetFilters = () => {
        // Reset form fields
        filterForm.resetFields();
        
        // Set default date range to current date
        filterForm.setFieldsValue({
            dateRange: [dayjs(), dayjs()]
        });
        
        // Reset filters state
        setFilters({
            dateRange: [dayjs(), dayjs()],
            machineId: undefined,
            machineTypeId: undefined,
            machineSubtypeId: undefined,
            source: '',
            priceRange: undefined,
            costOfGoodRange: undefined,
            shippingCostRange: undefined,
            purchaseLocation: ''
        });
        
        // Fetch orders with reset filters
        fetchOrders();
    };

    return (
        <Layout>
            <Content style={{ padding: '24px' }}>
            <Card>

                <div style={{ padding: '24px' }}>
                    {contextHolder}
                    <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <ShoppingCartOutlined style={{ fontSize: 24, marginRight: 8 }} />
                            <h1 style={{ margin: 0 }}>Quản lý đơn hàng</h1>
                        </div>
                        <Space>
                            <Button 
                                icon={<FilterOutlined />} 
                                onClick={() => setIsFilterVisible(!isFilterVisible)}
                            >
                                Bộ lọc
                            </Button>
                            <Dropdown
                                menu={{ items: menuItems }}
                                trigger={['click']}
                                placement="bottomRight"
                                open={columnDropdownVisible}
                                onOpenChange={handleDropdownVisibleChange}
                            >
                                <Button icon={<SettingOutlined />}>Hiển thị cột</Button>
                            </Dropdown>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    setEditingId(null);
                                    form.resetFields();
                                    setIsModalVisible(true);
                                }}
                            >
                                Thêm đơn hàng
                            </Button>
                        </Space>
                    </div>

                    {isFilterVisible && (
                        <Card style={{ marginBottom: '16px' }}>
                            <Form 
                                form={filterForm} 
                                layout="vertical" 
                                onValuesChange={handleFilterChange}
                                initialValues={filters}
                            >
                                <Row gutter={[16, 16]}>
                                    <Col span={24}>
                                        <Form.Item name="dateRange" label="Ngày bán">
                                            <RangePicker style={{ width: '100%' }} />
                                        </Form.Item>
                                    </Col>
                                    
                                    <Col span={8}>
                                        <Form.Item name="machineId" label="Máy">
                                            <Select 
                                                allowClear 
                                                placeholder="Chọn máy"
                                                style={{ width: '100%' }}
                                            >
                                                {machines.map(machine => (
                                                    <Select.Option key={machine.id} value={machine.id}>
                                                        {machine.name}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    
                                    <Col span={8}>
                                        <Form.Item name="machineTypeId" label="Loại máy">
                                            <Select 
                                                allowClear 
                                                placeholder="Chọn loại máy"
                                                style={{ width: '100%' }}
                                            >
                                                {machineTypes.map(type => (
                                                    <Select.Option key={type.id} value={type.id}>
                                                        {type.name}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    
                                    <Col span={8}>
                                        <Form.Item name="machineSubtypeId" label="Phân loại máy">
                                            <Select 
                                                allowClear 
                                                placeholder="Chọn phân loại máy"
                                                style={{ width: '100%' }}
                                            >
                                                {machineSubtypes.map(subtype => (
                                                    <Select.Option key={subtype.id} value={subtype.id}>
                                                        {subtype.name}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={8}>
                                        <Form.Item name="source" label="Nguồn xe">
                                            <Input placeholder="Nhập nguồn xe" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item name="purchaseLocation" label="Nơi mua">
                                            <Input placeholder="Nhập nơi mua" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={8}>
                                        <Form.Item name="priceRange" label="Giá bán">
                                            <Input.Group compact>
                                                <InputNumber 
                                                    style={{ width: '50%' }} 
                                                    placeholder="Từ" 
                                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                                />
                                                <InputNumber 
                                                    style={{ width: '50%' }} 
                                                    placeholder="Đến" 
                                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                                />
                                            </Input.Group>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item name="costOfGoodRange" label="Giá nhập hàng">
                                            <Input.Group compact>
                                                <InputNumber 
                                                    style={{ width: '50%' }} 
                                                    placeholder="Từ" 
                                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                                />
                                                <InputNumber 
                                                    style={{ width: '50%' }} 
                                                    placeholder="Đến" 
                                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                                />
                                            </Input.Group>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item name="shippingCostRange" label="Tiền vận chuyển">
                                            <Input.Group compact>
                                                <InputNumber 
                                                    style={{ width: '50%' }} 
                                                    placeholder="Từ" 
                                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                                />
                                                <InputNumber 
                                                    style={{ width: '50%' }} 
                                                    placeholder="Đến" 
                                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                                />
                                            </Input.Group>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24} style={{ textAlign: 'right' }}>
                                        <Space>
                                            <Button onClick={handleResetFilters}>
                                                Đặt lại
                                            </Button>
                                            <Button type="primary" onClick={handleFilterSubmit}>
                                                Áp dụng bộ lọc
                                            </Button>
                                        </Space>
                                    </Col>
                                </Row>
                            </Form>
                        </Card>
                    )}

                    <Table
                        columns={visibleColumns}
                        dataSource={orders}
                        rowKey="id"
                        loading={loading}
                        scroll={{ x: 1500 }}
                        pagination={{ pageSize: 10 }}
                        onChange={handleTableChange}
                        sortDirections={['descend', 'ascend']}
                        sortedInfo={sortedInfo}
                    />

                    <Modal
                        title={editingId ? 'Chỉnh sửa đơn hàng' : 'Thêm đơn hàng mới'}
                        open={isModalVisible}
                        onOk={handleModalOk}
                        onCancel={() => {
                            setIsModalVisible(false);
                            form.resetFields();
                            setEditingId(null);
                        }}
                        width={1000}
                        style={{ maxWidth: '90vw' }}
                        styles={{
                            body: {
                                maxHeight: '80vh',
                                overflow: 'auto'
                            }
                        }}
                    >
                        <Form form={form} layout="vertical">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <Form.Item
                                    name="date"
                                    label="Ngày bán"
                                    rules={[{ required: true, message: 'Vui lòng chọn ngày bán!' }]}
                                >
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>

                                <Form.Item
                                    name="machine_id"
                                    label="Máy"
                                    rules={[{ required: true, message: 'Vui lòng chọn máy!' }]}
                                >
                                    <Select>
                                        {machines.map(machine => (
                                            <Select.Option key={machine.id} value={machine.id}>
                                                {machine.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="machine_type_id"
                                    label="Loại máy"
                                    rules={[{ required: true, message: 'Vui lòng chọn loại máy!' }]}
                                >
                                    <Select>
                                        {machineTypes.map(type => (
                                            <Select.Option key={type.id} value={type.id}>
                                                {type.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="machine_subtype_id"
                                    label="Phân loại máy"
                                    rules={[{ required: true, message: 'Vui lòng chọn phân loại máy!' }]}
                                >
                                    <Select>
                                        {machineSubtypes.map(subtype => (
                                            <Select.Option key={subtype.id} value={subtype.id}>
                                                {subtype.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="customer_name"
                                    label="Tên khách"
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    name="phone"
                                    label="SĐT"
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    name="source"
                                    label="Nguồn xe"
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    name="price"
                                    label="Giá bán (VND)"
                                    rules={[{ required: true, message: 'Vui lòng nhập giá bán!' }]}
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="cost_of_good"
                                    label="Giá nhập hàng (VND)"
                                    rules={[{ required: true, message: 'Vui lòng nhập giá nhập hàng!' }]}
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="shipping_cost"
                                    label="Tiền vận chuyển (VND)"
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="purchase_location"
                                    label="Nơi mua"
                                >
                                    <TextArea rows={2} />
                                </Form.Item>

                                <Form.Item
                                    name="note"
                                    label="Ghi chú"
                                >
                                    <TextArea rows={2} />
                                </Form.Item>
                            </div>
                        </Form>
                    </Modal>
                </div>
                </Card>
            </Content>
        </Layout>
    );
};

export default Orders; 