import { Layout, Card, Typography } from 'antd';

const { Title } = Typography;
const { Content } = Layout;

const Dashboard = () => {
    return (
        <Content>
            <Title level={4}>Trang chủ</Title>
            <Card>
                <Title level={5}>Bảng điều khiển</Title>
                {/* Add your dashboard content here */}
            </Card>
        </Content>
    );
};

export default Dashboard; 