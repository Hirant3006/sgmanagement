import { useState } from 'react';
import { Tabs,Card, Typography, Layout } from 'antd';
import {
    ToolOutlined,
    AppstoreOutlined,
    SettingOutlined
} from '@ant-design/icons';
import Machines from './Machines';
import MachineTypes from './MachineTypes';
import MachineSubtypes from './MachineSubtypes';
const { Title } = Typography;
const { Content } = Layout;
const MachineManagement = () => {
    const [currentTab, setCurrentTab] = useState('0');

    const handleTabChange = (key) => {
        setCurrentTab(key);
    };

    const items = [
        {
            key: '0',
            label: (
                <span>
                    <ToolOutlined />
                    <span style={{ marginLeft: 8 }}>Danh sách máy</span>
                </span>
            ),
            children: <Machines />,
        },
        {
            key: '1',
            label: (
                <span>
                    <AppstoreOutlined />
                    <span style={{ marginLeft: 8 }}>Loại máy</span>
                </span>
            ),
            children: <MachineTypes />,
        },
        {
            key: '2',
            label: (
                <span>
                    <SettingOutlined />
                    <span style={{ marginLeft: 8 }}>Phân loại máy</span>
                </span>
            ),
            children: <MachineSubtypes />,
        },
    ];

    return (
        <Content>
            <Card>
                <Title level={5}>Quản lý máy móc</Title>
                <Tabs
                    activeKey={currentTab}
                    onChange={handleTabChange}
                    items={items}
                    type="card"
                />
            </Card>
        </Content>
    );
};

export default MachineManagement; 