import { Layout, Card, Typography, Row, Col, Statistic } from 'antd';
import { ToolOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Content } = Layout;

const Dashboard = () => {
    return (
        <Content>
            <Title level={4}>Trang chủ</Title>
            <Card>
                <Title level={5}>Bảng điều khiển</Title>
                <Row gutter={16}>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Tổng số máy"
                                value={0}
                                prefix={<ToolOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Loại máy"
                                value={0}
                                prefix={<AppstoreOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Phân loại máy"
                                value={0}
                                prefix={<SettingOutlined />}
                            />
                        </Card>
                    </Col>
                </Row>
            </Card>
        </Content>
    );
};

export default Dashboard; 