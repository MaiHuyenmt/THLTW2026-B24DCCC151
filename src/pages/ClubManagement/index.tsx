import React, { useMemo, useState } from 'react';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Select,
  Space,
  Statistic,
  Tabs,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined, UnorderedListOutlined, BarChartOutlined } from '@ant-design/icons';
import moment from 'moment';
import ColumnChart from '@/components/Chart/ColumnChart';
import type { ColumnsType } from 'antd/es/table';

const { TextArea } = Input;
const { Option } = Select;

const initialClubs = [
  {
    id: 1,
    avatar: 'https://i.pravatar.cc/100?img=12',
    name: 'CLB Kỹ năng mềm',
    founded: '2021-03-10',
    description: '<p>Đào tạo kỹ năng giao tiếp, thuyết trình và lãnh đạo.</p>',
    leader: 'Nguyễn Văn A',
    active: true,
  },
  {
    id: 2,
    avatar: 'https://i.pravatar.cc/100?img=24',
    name: 'CLB Công nghệ',
    founded: '2019-08-20',
    description: '<p>Thảo luận công nghệ mới, coding và dự án nhóm.</p>',
    leader: 'Trần Thị B',
    active: true,
  },
  {
    id: 3,
    avatar: 'https://i.pravatar.cc/100?img=30',
    name: 'CLB Âm nhạc',
    founded: '2022-01-15',
    description: '<p>Giao lưu âm nhạc và biểu diễn.</p>',
    leader: 'Lê Văn C',
    active: false,
  },
];

const initialApplications = [
  {
    id: 101,
    name: 'Phạm Nhật Minh',
    email: 'minh.pham@example.com',
    phone: '0945123456',
    gender: 'Nam',
    address: 'Hà Nội',
    skills: 'Lập trình React, thuyết trình',
    clubId: 2,
    reason: 'Muốn tham gia CLB Công nghệ để học thêm frontend.',
    status: 'Pending',
    note: '',
    createdAt: '2025-04-01 10:00',
    history: [],
  },
  {
    id: 102,
    name: 'Ngô Thị Lan',
    email: 'lan.ngo@example.com',
    phone: '0912345678',
    gender: 'Nữ',
    address: 'Hồ Chí Minh',
    skills: 'Hát, guitar',
    clubId: 3,
    reason: 'Yêu thích âm nhạc và muốn tham gia biểu diễn.',
    status: 'Approved',
    note: '',
    createdAt: '2025-03-28 15:30',
    history: [
      { action: 'Approved', by: 'Admin', at: '2025-03-28 16:00', reason: '' },
    ],
  },
  {
    id: 103,
    name: 'Đỗ Minh Châu',
    email: 'chau.do@example.com',
    phone: '0966234567',
    gender: 'Khác',
    address: 'Đà Nẵng',
    skills: 'Thiết kế đồ họa, marketing',
    clubId: 1,
    reason: 'Muốn cải thiện kỹ năng mềm và kết nối bạn bè.',
    status: 'Rejected',
    note: 'Chưa phù hợp lịch sinh hoạt',
    createdAt: '2025-03-29 09:20',
    history: [
      { action: 'Rejected', by: 'Admin', at: '2025-03-29 10:00', reason: 'Chưa phù hợp lịch sinh hoạt' },
    ],
  },
];

const ClubManagement = () => {
  const [clubs, setClubs] = useState(initialClubs);
  const [applications, setApplications] = useState(initialApplications);
  const [clubVisible, setClubVisible] = useState(false);
  const [appVisible, setAppVisible] = useState(false);
  const [rejectVisible, setRejectVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [changeClubVisible, setChangeClubVisible] = useState(false);
  const [memberModalVisible, setMemberModalVisible] = useState(false);
  const [selectedClubForMembers, setSelectedClubForMembers] = useState<any>(null);
  const [editingClub, setEditingClub] = useState<any>(null);
  const [editingApp, setEditingApp] = useState<any>(null);
  const [viewingApp, setViewingApp] = useState<any>(null);
  const [selectedAppIds, setSelectedAppIds] = useState<React.Key[]>([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState<React.Key[]>([]);
  const [rejectTargetIds, setRejectTargetIds] = useState<React.Key[]>([]);
  const [rejectReason, setRejectReason] = useState('');
  const [historyTarget, setHistoryTarget] = useState<any>(null);
  const [searchClub, setSearchClub] = useState('');
  const [searchApp, setSearchApp] = useState('');
  const [searchMember, setSearchMember] = useState('');

  const [clubForm] = Form.useForm();
  const [appForm] = Form.useForm();
  const [changeClubForm] = Form.useForm();

  const members = useMemo(
    () => applications.filter((item) => item.status === 'Approved'),
    [applications],
  );

  const clubOptions = useMemo(
    () => clubs.map((club) => ({ label: club.name, value: club.id })),
    [clubs],
  );

  const filteredClubs = useMemo(
    () =>
      clubs.filter((club) =>
        club.name.toLowerCase().includes(searchClub.toLowerCase()) ||
        club.leader.toLowerCase().includes(searchClub.toLowerCase()),
      ),
    [clubs, searchClub],
  );

  const filteredApplications = useMemo(
    () =>
      applications.filter((item) => {
        const keyword = searchApp.toLowerCase();
        return (
          item.name.toLowerCase().includes(keyword) ||
          item.email.toLowerCase().includes(keyword) ||
          item.phone.includes(keyword) ||
          item.address.toLowerCase().includes(keyword)
        );
      }),
    [applications, searchApp],
  );

  const filteredMembers = useMemo(
    () =>
      members.filter((item) => {
        const keyword = searchMember.toLowerCase();
        return (
          item.name.toLowerCase().includes(keyword) ||
          item.email.toLowerCase().includes(keyword) ||
          item.phone.includes(keyword) ||
          item.address.toLowerCase().includes(keyword)
        );
      }),
    [members, searchMember],
  );

  const summary = useMemo(() => {
    return {
      totalClubs: clubs.length,
      pending: applications.filter((item) => item.status === 'Pending').length,
      approved: applications.filter((item) => item.status === 'Approved').length,
      rejected: applications.filter((item) => item.status === 'Rejected').length,
    };
  }, [clubs.length, applications]);

  const chartData = useMemo(() => {
    const xAxis = clubs.map((club) => club.name);
    const pending = clubs.map((club) =>
      applications.filter((item) => item.clubId === club.id && item.status === 'Pending').length,
    );
    const approved = clubs.map((club) =>
      applications.filter((item) => item.clubId === club.id && item.status === 'Approved').length,
    );
    const rejected = clubs.map((club) =>
      applications.filter((item) => item.clubId === club.id && item.status === 'Rejected').length,
    );
    return { xAxis, pending, approved, rejected };
  }, [clubs, applications]);

  const clubColumns: ColumnsType<any> = [
    {
      title: 'Ảnh đại diện',
      dataIndex: 'avatar',
      width: 100,
      render: (value) => <img src={value} alt='avatar' style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />,
    },
    {
      title: 'Tên CLB',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      width: 200,
    },
    {
      title: 'Ngày thành lập',
      dataIndex: 'founded',
      sorter: (a, b) => new Date(a.founded).getTime() - new Date(b.founded).getTime(),
      width: 160,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      render: (value) => <div dangerouslySetInnerHTML={{ __html: value }} style={{ maxHeight: 56, overflow: 'hidden' }} />,
    },
    {
      title: 'Chủ nhiệm',
      dataIndex: 'leader',
      width: 180,
      sorter: (a, b) => a.leader.localeCompare(b.leader),
    },
    {
      title: 'Hoạt động',
      dataIndex: 'active',
      width: 120,
      filters: [
        { text: 'Hoạt động', value: true },
        { text: 'Ngưng hoạt động', value: false },
      ],
      onFilter: (value, record) => record.active === value,
      render: (value) => (value ? <Tag color='green'>Có</Tag> : <Tag color='red'>Không</Tag>),
    },
    {
      title: 'Thao tác',
      width: 260,
      align: 'center',
      render: (_, record) => (
        <Space>
          <Tooltip title='Xem thành viên'>
            <Button
              icon={<UnorderedListOutlined />}
              onClick={() => {
                setSelectedClubForMembers(record);
                setMemberModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title='Sửa CLB'>
            <Button
              icon={<EditOutlined />}
              type='primary'
              onClick={() => {
                setEditingClub(record);
                setClubVisible(true);
                clubForm.setFieldsValue({
                  ...record,
                  active: record.active ? 'true' : 'false',
                  founded: record.founded ? moment(record.founded) : undefined,
                });
              }}
            />
          </Tooltip>
          <Popconfirm
            title='Xác nhận xóa CLB này?'
            onConfirm={() => {
              setClubs((prev) => prev.filter((club) => club.id !== record.id));
              setApplications((prev) => prev.filter((app) => app.clubId !== record.id));
              message.success('Xóa CLB thành công');
            }}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const appColumns: ColumnsType<any> = [
    { title: 'Họ tên', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name), width: 170 },
    { title: 'Email', dataIndex: 'email', width: 220 },
    { title: 'SĐT', dataIndex: 'phone', width: 140 },
    { title: 'Giới tính', dataIndex: 'gender', width: 120, filters: [{ text: 'Nam', value: 'Nam' }, { text: 'Nữ', value: 'Nữ' }, { text: 'Khác', value: 'Khác' }], onFilter: (value, record) => record.gender === value },
    { title: 'Địa chỉ', dataIndex: 'address', width: 200 },
    { title: 'Sở trường', dataIndex: 'skills', width: 220 },
    {
      title: 'CLB',
      dataIndex: 'clubId',
      width: 180,
      render: (value) => clubs.find((club) => club.id === value)?.name || 'Chưa chọn',
      filters: clubs.map((club) => ({ text: club.name, value: club.id })),
      onFilter: (value, record) => record.clubId === value,
    },
    { title: 'Lý do đăng ký', dataIndex: 'reason', width: 280 },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 140,
      filters: [
        { text: 'Pending', value: 'Pending' },
        { text: 'Approved', value: 'Approved' },
        { text: 'Rejected', value: 'Rejected' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (value) => {
        const color = value === 'Approved' ? 'green' : value === 'Rejected' ? 'red' : 'gold';
        return <Tag color={color}>{value}</Tag>;
      },
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      width: 220,
      render: (value) => value || '-',
    },
    {
      title: 'Thao tác',
      width: 320,
      render: (_, record) => (
        <Space wrap>
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setViewingApp(record);
              setAppVisible(true);
            }}
          >
            Xem
          </Button>
          <Button
            icon={<EditOutlined />}
            type='primary'
            onClick={() => {
              setEditingApp(record);
              setAppVisible(true);
              appForm.setFieldsValue({
                ...record,
                clubId: record.clubId,
              });
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title='Xác nhận xóa đơn đăng ký này?'
            onConfirm={() => {
              setApplications((prev) => prev.filter((item) => item.id !== record.id));
              message.success('Xóa đơn đăng ký thành công');
            }}
          >
            <Button danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
          {record.status === 'Pending' ? (
            <Tooltip title='Duyệt đơn'>
              <Button
                icon={<CheckCircleOutlined />}
                type='default'
                onClick={() => handleApprove([record.id])}
              >
                Duyệt
              </Button>
            </Tooltip>
          ) : null}
          {record.status === 'Pending' ? (
            <Tooltip title='Từ chối đơn'>
              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => {
                  setRejectTargetIds([record.id]);
                  setRejectReason('');
                  setRejectVisible(true);
                }}
              >
                Từ chối
              </Button>
            </Tooltip>
          ) : null}
          <Button
            type='link'
            onClick={() => {
              setHistoryTarget(record);
              setHistoryVisible(true);
            }}
          >
            Lịch sử
          </Button>
        </Space>
      ),
    },
  ];

  const memberColumns: ColumnsType<any> = [
    { title: 'Họ tên', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name), width: 160 },
    { title: 'Email', dataIndex: 'email', width: 220 },
    { title: 'SĐT', dataIndex: 'phone', width: 140 },
    { title: 'Giới tính', dataIndex: 'gender', width: 120 },
    { title: 'Địa chỉ', dataIndex: 'address', width: 180 },
    {
      title: 'CLB hiện tại',
      dataIndex: 'clubId',
      width: 200,
      render: (value) => clubs.find((club) => club.id === value)?.name || 'Chưa chọn',
    },
  ];

  const handleResetClubForm = () => {
    setEditingClub(null);
    clubForm.resetFields();
  };

  const handleSaveClub = (values: any) => {
    const payload = {
      ...values,
      active: values.active === 'true',
      founded: values.founded ? values.founded.format('YYYY-MM-DD') : values.founded,
    };
    if (editingClub) {
      setClubs((prev) => prev.map((item) => (item.id === editingClub.id ? { ...item, ...payload } : item)));
      message.success('Cập nhật CLB thành công');
    } else {
      setClubs((prev) => [
        ...prev,
        { id: Date.now(), ...payload, avatar: payload.avatar || 'https://i.pravatar.cc/100?img=40' },
      ]);
      message.success('Thêm CLB mới thành công');
    }
    setClubVisible(false);
    handleResetClubForm();
  };

  const handleSaveApplication = (values: any) => {
    const payload = {
      ...values,
      status: values.status || 'Pending',
      note: values.note || '',
      history: editingApp?.history ?? [],
      createdAt: editingApp?.createdAt || new Date().toISOString().slice(0, 16).replace('T', ' '),
    };

    if (editingApp) {
      setApplications((prev) => prev.map((item) => (item.id === editingApp.id ? { ...item, ...payload } : item)));
      message.success('Cập nhật đơn đăng ký thành công');
    } else {
      setApplications((prev) => [
        ...prev,
        { id: Date.now(), ...payload, history: [], createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ') },
      ]);
      message.success('Thêm đơn đăng ký thành công');
    }
    setAppVisible(false);
    setEditingApp(null);
    appForm.resetFields();
  };

  const addHistory = (ids: React.Key[], action: string, reason = '') => {
    const now = new Date();
    const at = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setApplications((prev) =>
      prev.map((item) => {
        if (ids.includes(item.id)) {
          const history = [...(item.history || []), { action, by: 'Admin', at, reason }];
          return {
            ...item,
            status: action === 'Approved' ? 'Approved' : action === 'Rejected' ? 'Rejected' : item.status,
            note: action === 'Rejected' ? reason || item.note : item.note,
            history,
          };
        }
        return item;
      }),
    );
  };

  function handleApprove(ids: React.Key[]) {
    addHistory(ids, 'Approved');
    message.success(`Đã duyệt ${ids.length} đơn`);
    setSelectedAppIds((prev) => prev.filter((id) => !ids.includes(id)));
  }

  const handleReject = () => {
    if (!rejectReason.trim()) {
      message.warning('Vui lòng nhập lý do từ chối');
      return;
    }
    addHistory(rejectTargetIds, 'Rejected', rejectReason);
    message.success(`Đã từ chối ${rejectTargetIds.length} đơn`);
    setRejectVisible(false);
    setRejectTargetIds([]);
    setRejectReason('');
    setSelectedAppIds((prev) => prev.filter((id) => !rejectTargetIds.includes(id)));
  };

  const handleChangeClub = (values: any) => {
    const targetClubId = values.clubId;
    setApplications((prev) =>
      prev.map((item) =>
        selectedMemberIds.includes(item.id) ? { ...item, clubId: targetClubId } : item,
      ),
    );
    message.success(`Đã chuyển ${selectedMemberIds.length} thành viên sang CLB mới`);
    setChangeClubVisible(false);
    setSelectedMemberIds([]);
    changeClubForm.resetFields();
  };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <h2>Quản lý Câu lạc bộ và Đăng ký thành viên</h2>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title='Số CLB' value={summary.totalClubs} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title='Đơn Pending' value={summary.pending} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title='Đơn Approved' value={summary.approved} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title='Đơn Rejected' value={summary.rejected} />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginBottom: 24 }}>
        <ColumnChart
          title='Đơn đăng ký theo CLB'
          xAxis={chartData.xAxis}
          yAxis={[chartData.pending, chartData.approved, chartData.rejected]}
          yLabel={['Pending', 'Approved', 'Rejected']}
          colors={['#fadb14', '#52c41a', '#ff4d4f']}
          height={360}
        />
      </Card>

      <Tabs defaultActiveKey='clubs'>
        <Tabs.TabPane tab='Danh sách CLB' key='clubs'>
          <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
            <Input.Search
              placeholder='Tìm CLB hoặc Chủ nhiệm'
              allowClear
              onSearch={(value) => setSearchClub(value)}
              onChange={(event) => setSearchClub(event.target.value)}
              style={{ width: 320 }}
            />
            <Button type='primary' icon={<PlusOutlined />} onClick={() => setClubVisible(true)}>
              Thêm CLB
            </Button>
          </Space>
          <Table
            columns={clubColumns}
            dataSource={filteredClubs}
            rowKey='id'
            pagination={{ pageSize: 6 }}
          />
        </Tabs.TabPane>

        <Tabs.TabPane tab='Đơn đăng ký thành viên' key='applications'>
          <Space wrap style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
            <Input.Search
              placeholder='Tìm theo tên, email, điện thoại, địa chỉ'
              allowClear
              onSearch={(value) => setSearchApp(value)}
              onChange={(event) => setSearchApp(event.target.value)}
              style={{ width: 360 }}
            />
            <Space wrap>
              <Button type='primary' icon={<PlusOutlined />} onClick={() => setAppVisible(true)}>
                Thêm đơn
              </Button>
              <Button
                disabled={!selectedAppIds.length}
                icon={<CheckCircleOutlined />}
                onClick={() => handleApprove(selectedAppIds)}
              >
                Duyệt {selectedAppIds.length ? `(${selectedAppIds.length})` : ''}
              </Button>
              <Button
                danger
                disabled={!selectedAppIds.length}
                icon={<CloseCircleOutlined />}
                onClick={() => {
                  setRejectTargetIds(selectedAppIds);
                  setRejectReason('');
                  setRejectVisible(true);
                }}
              >
                Từ chối {selectedAppIds.length ? `(${selectedAppIds.length})` : ''}
              </Button>
              <Button icon={<BarChartOutlined />} onClick={() => setHistoryVisible(true)}>
                Xem lịch sử chung
              </Button>
            </Space>
          </Space>
          <Table
            rowSelection={{
              selectedRowKeys: selectedAppIds,
              onChange: (selectedRowKeys) => setSelectedAppIds(selectedRowKeys),
            }}
            columns={appColumns}
            dataSource={filteredApplications}
            rowKey='id'
            pagination={{ pageSize: 8 }}
          />
        </Tabs.TabPane>

        <Tabs.TabPane tab='Quản lý thành viên CLB' key='members'>
          <Space wrap style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
            <Input.Search
              placeholder='Tìm thành viên'
              allowClear
              onSearch={(value) => setSearchMember(value)}
              onChange={(event) => setSearchMember(event.target.value)}
              style={{ width: 360 }}
            />
            <Button
              type='primary'
              disabled={!selectedMemberIds.length}
              onClick={() => setChangeClubVisible(true)}
            >
              Chuyển CLB ({selectedMemberIds.length})
            </Button>
          </Space>
          <Table
            rowSelection={{
              selectedRowKeys: selectedMemberIds,
              onChange: (selectedRowKeys) => setSelectedMemberIds(selectedRowKeys),
            }}
            columns={memberColumns}
            dataSource={filteredMembers}
            rowKey='id'
            pagination={{ pageSize: 8 }}
          />
        </Tabs.TabPane>
      </Tabs>

      <Modal
        title={editingClub ? 'Chỉnh sửa CLB' : 'Thêm CLB mới'}
        visible={clubVisible}
        onCancel={() => {
          setClubVisible(false);
          handleResetClubForm();
        }}
        footer={null}
        destroyOnClose
      >
        <Form form={clubForm} layout='vertical' onFinish={handleSaveClub} initialValues={{ active: 'true', founded: moment() }}>
          <Form.Item label='Avatar (URL)' name='avatar'>
            <Input placeholder='https://...' />
          </Form.Item>
          <Form.Item label='Tên CLB' name='name' rules={[{ required: true, message: 'Vui lòng nhập tên CLB' }]}> 
            <Input />
          </Form.Item>
          <Form.Item label='Ngày thành lập' name='founded' rules={[{ required: true, message: 'Vui lòng chọn ngày thành lập' }]}> 
            <DatePicker format='YYYY-MM-DD' style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label='Mô tả (HTML)' name='description' rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item label='Chủ nhiệm CLB' name='leader' rules={[{ required: true, message: 'Vui lòng nhập chủ nhiệm' }]}> 
            <Input />
          </Form.Item>
          <Form.Item label='Hoạt động' name='active' rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}> 
            <Radio.Group>
              <Radio value='true'>Có</Radio>
              <Radio value='false'>Không</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item style={{ textAlign: 'right' }}>
            <Button style={{ marginRight: 8 }} onClick={() => setClubVisible(false)}>
              Hủy
            </Button>
            <Button type='primary' htmlType='submit'>
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={viewingApp ? 'Chi tiết đơn đăng ký' : editingApp ? 'Chỉnh sửa đơn đăng ký' : 'Thêm đơn đăng ký mới'}
        visible={appVisible}
        onCancel={() => {
          setAppVisible(false);
          setEditingApp(null);
          setViewingApp(null);
          appForm.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        {viewingApp ? (
          <Descriptions column={1} bordered>
            <Descriptions.Item label='Họ tên'>{viewingApp.name}</Descriptions.Item>
            <Descriptions.Item label='Email'>{viewingApp.email}</Descriptions.Item>
            <Descriptions.Item label='SĐT'>{viewingApp.phone}</Descriptions.Item>
            <Descriptions.Item label='Giới tính'>{viewingApp.gender}</Descriptions.Item>
            <Descriptions.Item label='Địa chỉ'>{viewingApp.address}</Descriptions.Item>
            <Descriptions.Item label='Sở trường'>{viewingApp.skills}</Descriptions.Item>
            <Descriptions.Item label='CLB'>{clubs.find((club) => club.id === viewingApp.clubId)?.name || '-'}</Descriptions.Item>
            <Descriptions.Item label='Lý do đăng ký'>{viewingApp.reason}</Descriptions.Item>
            <Descriptions.Item label='Trạng thái'>{viewingApp.status}</Descriptions.Item>
            <Descriptions.Item label='Ghi chú'>{viewingApp.note || '-'}</Descriptions.Item>
            <Descriptions.Item label='Lịch sử hành động'>
              {viewingApp.history?.length ? (
                <Space direction='vertical'>
                  {viewingApp.history.map((item: any, index: number) => (
                    <div key={`${item.at}-${item.action}-${index}`}>
                      <strong>{item.at}</strong> - {item.action} bởi {item.by}
                      {item.reason ? ` (${item.reason})` : ''}
                    </div>
                  ))}
                </Space>
              ) : (
                'Không có lịch sử'
              )}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <Form
            form={appForm}
            layout='vertical'
            onFinish={handleSaveApplication}
            initialValues={{ gender: 'Nam', status: 'Pending', clubId: clubs[0]?.id }}
          >
            <Form.Item label='Họ tên' name='name' rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}> 
              <Input />
            </Form.Item>
            <Form.Item label='Email' name='email' rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}> 
              <Input />
            </Form.Item>
            <Form.Item label='SĐT' name='phone' rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}> 
              <Input />
            </Form.Item>
            <Form.Item label='Giới tính' name='gender'> 
              <Radio.Group>
                <Radio value='Nam'>Nam</Radio>
                <Radio value='Nữ'>Nữ</Radio>
                <Radio value='Khác'>Khác</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label='Địa chỉ' name='address' rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}> 
              <Input />
            </Form.Item>
            <Form.Item label='Sở trường' name='skills' rules={[{ required: true, message: 'Vui lòng nhập sở trường' }]}> 
              <TextArea rows={3} />
            </Form.Item>
            <Form.Item label='Câu lạc bộ' name='clubId' rules={[{ required: true, message: 'Vui lòng chọn CLB' }]}> 
              <Select options={clubOptions} />
            </Form.Item>
            <Form.Item label='Lý do đăng ký' name='reason' rules={[{ required: true, message: 'Vui lòng nhập lý do' }]}> 
              <TextArea rows={3} />
            </Form.Item>
            <Form.Item label='Trạng thái' name='status'> 
              <Select>
                <Option value='Pending'>Pending</Option>
                <Option value='Approved'>Approved</Option>
                <Option value='Rejected'>Rejected</Option>
              </Select>
            </Form.Item>
            <Form.Item label='Ghi chú' name='note'> 
              <TextArea rows={2} />
            </Form.Item>
            <Form.Item style={{ textAlign: 'right' }}>
              <Button style={{ marginRight: 8 }} onClick={() => setAppVisible(false)}>
                Hủy
              </Button>
              <Button type='primary' htmlType='submit'>
                Lưu
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>

      <Modal
        title='Xác nhận từ chối đơn đăng ký'
        visible={rejectVisible}
        onCancel={() => setRejectVisible(false)}
        onOk={handleReject}
        okText='Xác nhận'
        cancelText='Hủy'
      >
        <Form layout='vertical'>
          <Form.Item label='Lý do từ chối'>
            <TextArea rows={4} value={rejectReason} onChange={(event) => setRejectReason(event.target.value)} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={historyTarget ? `Lịch sử đơn: ${historyTarget.name}` : 'Lịch sử thao tác chung'}
        visible={historyVisible}
        onCancel={() => {
          setHistoryVisible(false);
          setHistoryTarget(null);
        }}
        footer={null}
        width={800}
      >
        <Space direction='vertical' style={{ width: '100%' }}>
          {historyTarget ? (
            historyTarget.history?.length ? (
              historyTarget.history.map((item: any, index: number) => (
                <Card key={`${item.at}-${item.action}-${item.by}-${index}`} size='small'>
                  <p>
                    <strong>{item.at}</strong> · {item.action} bởi {item.by}
                  </p>
                  {item.reason ? <p>Lý do: {item.reason}</p> : null}
                </Card>
              ))
            ) : (
              <div>Không có lịch sử cho đơn này</div>
            )
          ) : (
            applications
              .flatMap((item) =>
                item.history?.map((historyItem) => ({
                  ...historyItem,
                  applicant: item.name,
                })),
              )
              .sort((a, b) => (a.at < b.at ? 1 : -1))
              .map((item, index) => (
                <Card key={`${item.at}-${item.action}-${item.applicant}-${index}`} size='small'>
                  <p>
                    <strong>{item.at}</strong> · {item.action} bởi {item.by} · {item.applicant}
                  </p>
                  {item.reason ? <p>Lý do: {item.reason}</p> : null}
                </Card>
              ))
          )}
        </Space>
      </Modal>

      <Modal
        title={`Thành viên CLB ${selectedClubForMembers?.name || ''}`}
        visible={memberModalVisible}
        onCancel={() => setMemberModalVisible(false)}
        footer={null}
      >
        <Table
          columns={memberColumns}
          dataSource={members.filter((item) => item.clubId === selectedClubForMembers?.id)}
          rowKey='id'
          pagination={false}
          size='small'
        />
      </Modal>

      <Modal
        title={`Chuyển CLB cho ${selectedMemberIds.length} thành viên`}
        visible={changeClubVisible}
        onCancel={() => setChangeClubVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={changeClubForm} layout='vertical' onFinish={handleChangeClub} initialValues={{ clubId: clubs[0]?.id }}>
          <Form.Item label='Chọn CLB mới' name='clubId' rules={[{ required: true, message: 'Vui lòng chọn CLB' }]}>
            <Select options={clubOptions} />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right' }}>
            <Button style={{ marginRight: 8 }} onClick={() => setChangeClubVisible(false)}>
              Hủy
            </Button>
            <Button type='primary' htmlType='submit'>
              Xác nhận chuyển
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClubManagement;
