import { Tabs, Card } from "antd";
import Dashboard from "./components/Dashboard";
import Appointments from "./components/Appointments";
import Employees from "./components/Employees";
import Reviews from "./components/Reviews";

export default function TH03() {
  return (
    <div style={{ padding: 20 }}>
      <Card>
        <h2>Hệ thống Đặt lịch & Quản lý Dịch vụ</h2>

        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Thống kê & Báo cáo" key="1">
            <Dashboard />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Quản lý lịch hẹn" key="2">
            <Appointments />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Nhân viên & Dịch vụ" key="3">
            <Employees />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Đánh giá & Phản hồi" key="4">
            <Reviews />
          </Tabs.TabPane>
        </Tabs>

      </Card>
    </div>
  );
}
