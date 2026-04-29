import React, { useMemo, useState } from 'react';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Progress,
  Row,
  Segmented,
  Select,
  Space,
  Table,
  Tag,
  Timeline,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FireTwoTone,
  HeartTwoTone,
  CheckCircleTwoTone,
  AimOutlined,
} from '@ant-design/icons';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import moment from 'moment';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface Workout {
  id: number;
  date: string;
  name: string;
  type: 'Cardio' | 'Strength' | 'Yoga' | 'HIIT' | 'Other';
  duration: number;
  calories: number;
  note: string;
  status: 'Hoàn thành' | 'Bỏ lỡ';
}

interface HealthRecord {
  id: number;
  date: string;
  weight: number;
  height: number;
  heartRate: number;
  sleepHours: number;
}

interface Goal {
  id: number;
  name: string;
  type: 'Giảm cân' | 'Tăng cơ' | 'Cải thiện sức bền' | 'Khác';
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  status: 'Đang thực hiện' | 'Đã đạt' | 'Đã hủy';
}

interface Exercise {
  id: number;
  name: string;
  muscle: 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Full Body';
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  description: string;
  caloriesPerHour: number;
  instructions: string;
}

const initialWorkouts: Workout[] = [
  {
    id: 1,
    date: '2026-04-28',
    name: 'Chạy bộ sáng',
    type: 'Cardio',
    duration: 40,
    calories: 360,
    note: 'Giữ nhịp ổn định',
    status: 'Hoàn thành',
  },
  {
    id: 2,
    date: '2026-04-27',
    name: 'Hít đất và plank',
    type: 'Strength',
    duration: 35,
    calories: 280,
    note: 'Tập trung cơ ngực và core',
    status: 'Hoàn thành',
  },
  {
    id: 3,
    date: '2026-04-26',
    name: 'Yoga phục hồi',
    type: 'Yoga',
    duration: 45,
    calories: 180,
    note: 'Thả lỏng toàn thân',
    status: 'Hoàn thành',
  },
  {
    id: 4,
    date: '2026-04-25',
    name: 'HIIT ngắn',
    type: 'HIIT',
    duration: 25,
    calories: 320,
    note: 'Chuỗi động tác cường độ cao',
    status: 'Bỏ lỡ',
  },
  {
    id: 5,
    date: '2026-04-24',
    name: 'Bài tập toàn thân',
    type: 'Other',
    duration: 50,
    calories: 450,
    note: 'Xoay vòng nhiều nhóm cơ',
    status: 'Hoàn thành',
  },
];

const initialHealth: HealthRecord[] = [
  {
    id: 1,
    date: '2026-04-28',
    weight: 70,
    height: 175,
    heartRate: 58,
    sleepHours: 7,
  },
  {
    id: 2,
    date: '2026-04-24',
    weight: 71,
    height: 175,
    heartRate: 60,
    sleepHours: 6.5,
  },
  {
    id: 3,
    date: '2026-04-20',
    weight: 72,
    height: 175,
    heartRate: 62,
    sleepHours: 6,
  },
];

const initialGoals: Goal[] = [
  {
    id: 1,
    name: 'Giảm 3kg',
    type: 'Giảm cân',
    targetValue: 67,
    currentValue: 70,
    unit: 'kg',
    deadline: '2026-05-30',
    status: 'Đang thực hiện',
  },
  {
    id: 2,
    name: 'Tăng cơ tay',
    type: 'Tăng cơ',
    targetValue: 40,
    currentValue: 36,
    unit: 'cm',
    deadline: '2026-06-15',
    status: 'Đang thực hiện',
  },
  {
    id: 3,
    name: 'Chạy 10km liên tục',
    type: 'Cải thiện sức bền',
    targetValue: 10,
    currentValue: 7,
    unit: 'km',
    deadline: '2026-06-01',
    status: 'Đang thực hiện',
  },
];

const initialExercises: Exercise[] = [
  {
    id: 1,
    name: 'Push-up',
    muscle: 'Arms',
    difficulty: 'Trung bình',
    description: 'Bài tập thân trên tác động vào ngực và tay sau.',
    caloriesPerHour: 500,
    instructions: 'Giữ lưng thẳng, hạ chậm và đẩy mạnh trở lại.',
  },
  {
    id: 2,
    name: 'Squat',
    muscle: 'Legs',
    difficulty: 'Trung bình',
    description: 'Bài tập chân cơ bản giúp tăng cường đùi và mông.',
    caloriesPerHour: 520,
    instructions: 'Đầu gối không vượt quá mũi chân, lưng thẳng.',
  },
  {
    id: 3,
    name: 'Plank',
    muscle: 'Core',
    difficulty: 'Dễ',
    description: 'Giữ cơ bụng và lưng thẳng trong tư thế tấm ván.',
    caloriesPerHour: 240,
    instructions: 'Siết core, giữ cổ thẳng với cột sống.',
  },
  {
    id: 4,
    name: 'Burpees',
    muscle: 'Full Body',
    difficulty: 'Khó',
    description: 'Bài tập toàn thân kết hợp jump squat và push-up.',
    caloriesPerHour: 700,
    instructions: 'Thực hiện liên tục, giữ nhịp tim cao.',
  },
  {
    id: 5,
    name: 'Dumbbell Row',
    muscle: 'Back',
    difficulty: 'Trung bình',
    description: 'Kéo tạ tay để phát triển lưng giữa và tay trước.',
    caloriesPerHour: 430,
    instructions: 'Giữ lưng thẳng, kéo tạ về phía hông.',
  },
];

const getBmi = (weight: number, height: number) => {
  const meters = height / 100;
  const bmi = weight / (meters * meters);
  return Number(bmi.toFixed(1));
};

const getBmiTag = (bmi: number) => {
  if (bmi < 18.5) {
    return { text: 'Thiếu cân', color: 'blue' };
  }
  if (bmi < 25) {
    return { text: 'Bình thường', color: 'green' };
  }
  if (bmi < 30) {
    return { text: 'Thừa cân', color: 'gold' };
  }
  return { text: 'Béo phì', color: 'red' };
};

const FitnessPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'workout' | 'health' | 'goals' | 'library'>('dashboard');
  const [workouts, setWorkouts] = useState<Workout[]>(initialWorkouts);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(initialHealth);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises);
  const [workoutSearch, setWorkoutSearch] = useState('');
  const [workoutTypeFilter, setWorkoutTypeFilter] = useState<string | null>(null);
  const [workoutDateRange, setWorkoutDateRange] = useState<[moment.Moment, moment.Moment] | null>(null);
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [editingHealth, setEditingHealth] = useState<HealthRecord | null>(null);
  const [goalStatusFilter, setGoalStatusFilter] = useState<'Tất cả' | 'Đang thực hiện' | 'Đã đạt' | 'Đã hủy'>('Tất cả');
  const [isGoalDrawerOpen, setIsGoalDrawerOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [goalForm] = Form.useForm();
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [isExerciseDetailOpen, setIsExerciseDetailOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [exerciseMuscleFilter, setExerciseMuscleFilter] = useState<string | null>(null);
  const [exerciseDifficultyFilter, setExerciseDifficultyFilter] = useState<string | null>(null);
  const [workoutForm] = Form.useForm();
  const [healthForm] = Form.useForm();
  const exerciseFormRef = React.useRef<any>(null);

  const workoutTypes = ['Cardio', 'Strength', 'Yoga', 'HIIT', 'Other'];
  const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'];
  const difficulties = ['Dễ', 'Trung bình', 'Khó'];

  const weeklyCount = useMemo(() => {
    const currentMonth = moment().month();
    const counts: Record<string, number> = {};
    for (let week = 1; week <= 4; week += 1) {
      counts[`Tuần ${week}`] = 0;
    }
    workouts.forEach((workout) => {
      const date = moment(workout.date);
      if (date.month() !== currentMonth) return;
      const weekNumber = Math.min(4, Math.floor((date.date() - 1) / 7) + 1);
      counts[`Tuần ${weekNumber}`] += 1;
    });
    return Object.values(counts);
  }, [workouts]);

  const weightTrend = useMemo(() => {
    const sorted = [...healthRecords].sort((a, b) => moment(a.date).diff(b.date));
    return sorted.map((record) => record.weight);
  }, [healthRecords]);

  const streak = useMemo(() => {
    let count = 0;
    const dates = new Set(workouts.filter((item) => item.status === 'Hoàn thành').map((item) => item.date));
    for (let i = 0; i < 7; i += 1) {
      const day = moment().subtract(i, 'days').format('YYYY-MM-DD');
      if (dates.has(day)) count += 1;
      else break;
    }
    return count;
  }, [workouts]);

  const monthlyCalories = useMemo(() => workouts.reduce((sum, item) => sum + item.calories, 0), [workouts]);
  const monthlyWorkouts = useMemo(() => workouts.filter((item) => moment(item.date).month() === moment().month()).length, [workouts]);
  const completedGoals = useMemo(() => goals.filter((goal) => goal.status === 'Đã đạt').length, [goals]);
  const goalsCompletion = useMemo(() => {
    if (goals.length === 0) return 0;
    return Math.round((completedGoals / goals.length) * 100);
  }, [completedGoals, goals.length]);
  const recentWorkouts = useMemo(
    () => [...workouts].sort((a, b) => moment(b.date).diff(a.date)).slice(0, 5),
    [workouts],
  );

  const filteredWorkouts = useMemo(() => {
    return workouts.filter((item) => {
      const searchMatch = item.name.toLowerCase().includes(workoutSearch.toLowerCase());
      const typeMatch = workoutTypeFilter ? item.type === workoutTypeFilter : true;
      const dateMatch = workoutDateRange
        ? moment(item.date).isBetween(workoutDateRange[0], workoutDateRange[1], 'day', '[]')
        : true;
      return searchMatch && typeMatch && dateMatch;
    });
  }, [workouts, workoutSearch, workoutTypeFilter, workoutDateRange]);

  const filteredGoals = useMemo(() => {
    if (goalStatusFilter === 'Tất cả') {
      return goals;
    }
    return goals.filter((goal) => goal.status === goalStatusFilter);
  }, [goals, goalStatusFilter]);

  const filteredExercises = useMemo(() => {
    return exercises.filter((item) => {
      const searchMatch = item.name.toLowerCase().includes(exerciseSearch.toLowerCase());
      const muscleMatch = exerciseMuscleFilter ? item.muscle === exerciseMuscleFilter : true;
      const difficultyMatch = exerciseDifficultyFilter ? item.difficulty === exerciseDifficultyFilter : true;
      return searchMatch && muscleMatch && difficultyMatch;
    });
  }, [exercises, exerciseSearch, exerciseMuscleFilter, exerciseDifficultyFilter]);

  const workoutColumns: any[] = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: Workout, b: Workout) => moment(a.date).unix() - moment(b.date).unix(),
    },
    {
      title: 'Loại bài tập',
      dataIndex: 'type',
      key: 'type',
      filters: workoutTypes.map((type) => ({ text: type, value: type })),
      onFilter: (value: any, record: Workout) => record.type === value,
    },
    {
      title: 'Thời lượng (phút)',
      dataIndex: 'duration',
      key: 'duration',
      sorter: (a: Workout, b: Workout) => a.duration - b.duration,
    },
    {
      title: 'Calo đốt',
      dataIndex: 'calories',
      key: 'calories',
      sorter: (a: Workout, b: Workout) => a.calories - b.calories,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (value: Workout['status']) => (
        <Tag color={value === 'Hoàn thành' ? 'green' : 'red'}>{value}</Tag>
      ),
      filters: [
        { text: 'Hoàn thành', value: 'Hoàn thành' },
        { text: 'Bỏ lỡ', value: 'Bỏ lỡ' },
      ],
      onFilter: (value: any, record: Workout) => record.status === value,
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 160,
      render: (_: any, record: Workout) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size='small'
            onClick={() => {
              setEditingWorkout(record);
              workoutForm.setFieldsValue({
                ...record,
                date: moment(record.date),
              });
              setIsWorkoutModalOpen(true);
            }}
          />
          <Popconfirm
            title='Xác nhận xóa buổi tập này?'
            onConfirm={() => setWorkouts(workouts.filter((item) => item.id !== record.id))}
          >
            <Button danger icon={<DeleteOutlined />} size='small' />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const healthColumns: any[] = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: HealthRecord, b: HealthRecord) => moment(a.date).unix() - moment(b.date).unix(),
    },
    {
      title: 'Cân nặng (kg)',
      dataIndex: 'weight',
      key: 'weight',
      sorter: (a: HealthRecord, b: HealthRecord) => a.weight - b.weight,
    },
    {
      title: 'Chiều cao (cm)',
      dataIndex: 'height',
      key: 'height',
    },
    {
      title: 'BMI',
      key: 'bmi',
      render: (_: any, record: HealthRecord) => {
        const bmi = getBmi(record.weight, record.height);
        const tag = getBmiTag(bmi);
        return (
          <Space>
            <span>{bmi}</span>
            <Tag color={tag.color}>{tag.text}</Tag>
          </Space>
        );
      },
    },
    {
      title: 'Nhịp tim nghỉ (bpm)',
      dataIndex: 'heartRate',
      key: 'heartRate',
    },
    {
      title: 'Giờ ngủ',
      dataIndex: 'sleepHours',
      key: 'sleepHours',
      render: (value: number) => `${value}h`,
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 160,
      render: (_: any, record: HealthRecord) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size='small'
            onClick={() => {
              setEditingHealth(record);
              healthForm.setFieldsValue({
                ...record,
                date: moment(record.date),
              });
              setIsHealthModalOpen(true);
            }}
          />
          <Popconfirm
            title='Xác nhận xóa chỉ số sức khỏe này?'
            onConfirm={() => setHealthRecords(healthRecords.filter((item) => item.id !== record.id))}
          >
            <Button danger icon={<DeleteOutlined />} size='small' />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const onSubmitWorkout = async () => {
    const values = await workoutForm.validateFields();
    const payload: Workout = {
      id: editingWorkout ? editingWorkout.id : Date.now(),
      date: values.date.format('YYYY-MM-DD'),
      name: values.name,
      type: values.type,
      duration: values.duration,
      calories: values.calories,
      note: values.note,
      status: values.status,
    };
    if (editingWorkout) {
      setWorkouts(workouts.map((item) => (item.id === editingWorkout.id ? payload : item)));
    } else {
      setWorkouts([payload, ...workouts]);
    }
    setEditingWorkout(null);
    setIsWorkoutModalOpen(false);
    workoutForm.resetFields();
  };

  const onSubmitHealth = async () => {
    const values = await healthForm.validateFields();
    const payload: HealthRecord = {
      id: editingHealth ? editingHealth.id : Date.now(),
      date: values.date.format('YYYY-MM-DD'),
      weight: values.weight,
      height: values.height,
      heartRate: values.heartRate,
      sleepHours: values.sleepHours,
    };
    if (editingHealth) {
      setHealthRecords(healthRecords.map((item) => (item.id === editingHealth.id ? payload : item)));
    } else {
      setHealthRecords([payload, ...healthRecords]);
    }
    setEditingHealth(null);
    setIsHealthModalOpen(false);
    healthForm.resetFields();
  };

  const handleGoalSubmit = async (values: any) => {
    const payload: Goal = {
      id: editingGoal ? editingGoal.id : Date.now(),
      name: values.name,
      type: values.type,
      targetValue: values.targetValue,
      currentValue: values.currentValue,
      unit: values.unit,
      deadline: values.deadline.format('YYYY-MM-DD'),
      status: values.status,
    };
    if (editingGoal) {
      setGoals(goals.map((item) => (item.id === editingGoal.id ? payload : item)));
    } else {
      setGoals([payload, ...goals]);
    }
    setEditingGoal(null);
    setIsGoalDrawerOpen(false);
    goalForm.resetFields();
  };

  const handleExerciseSubmit = async (values: any) => {
    const payload: Exercise = {
      id: editingExercise ? editingExercise.id : Date.now(),
      name: values.name,
      muscle: values.muscle,
      difficulty: values.difficulty,
      description: values.description,
      caloriesPerHour: values.caloriesPerHour,
      instructions: values.instructions,
    };
    if (editingExercise) {
      setExercises(exercises.map((item) => (item.id === editingExercise.id ? payload : item)));
    } else {
      setExercises([payload, ...exercises]);
    }
    setEditingExercise(null);
    setIsExerciseModalOpen(false);
  };

  const goalProgress = (goal: Goal) => {
    const progress = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
    return progress;
  };

  const chartOptions: ApexOptions = {
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    xaxis: {
      categories: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
    },
    stroke: { curve: 'smooth' },
    dataLabels: { enabled: false },
    grid: { strokeDashArray: 4 },
  };

  const weightOptions: ApexOptions = {
    ...chartOptions,
    xaxis: {
      categories: [...healthRecords].sort((a, b) => moment(a.date).diff(b.date)).map((record) => moment(record.date).format('DD/MM')),
    },
  };

  return (
    <div style={{ padding: 24, minHeight: '100vh' }}>
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card>
            <Row align='middle' justify='space-between'>
              <Col>
                <Title level={3} style={{ margin: 0 }}>
                  Ứng dụng theo dõi sức khỏe và tập luyện
                </Title>
                <Paragraph style={{ margin: 0, color: '#666' }}>
                  Quản lý dashboard, nhật ký tập luyện, chỉ số sức khỏe, mục tiêu và thư viện bài tập.
                </Paragraph>
              </Col>
              <Col>
                <Segmented
                  options={[
                    { label: 'Dashboard', value: 'dashboard' },
                    { label: 'Tập luyện', value: 'workout' },
                    { label: 'Chỉ số', value: 'health' },
                    { label: 'Mục tiêu', value: 'goals' },
                    { label: 'Thư viện', value: 'library' },
                  ]}
                  value={activeTab}
                  onChange={(value) => setActiveTab(value as any)}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {activeTab === 'dashboard' && (
        <>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={6}>
              <Card>
                <Space align='center'>
                  <FireTwoTone twoToneColor='#eb2f96' style={{ fontSize: 24 }} />
                  <div>
                    <div style={{ color: '#888' }}>Buổi tập tháng</div>
                    <div style={{ fontSize: 28, fontWeight: 700 }}>{monthlyWorkouts}</div>
                  </div>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={6}>
              <Card>
                <Space align='center'>
                  <HeartTwoTone twoToneColor='#52c41a' style={{ fontSize: 24 }} />
                  <div>
                    <div style={{ color: '#888' }}>Calo đã đốt</div>
                    <div style={{ fontSize: 28, fontWeight: 700 }}>{monthlyCalories}</div>
                  </div>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={6}>
              <Card>
                <Space align='center'>
                  <CheckCircleTwoTone twoToneColor='#1890ff' style={{ fontSize: 24 }} />
                  <div>
                    <div style={{ color: '#888' }}>Streak</div>
                    <div style={{ fontSize: 28, fontWeight: 700 }}>{streak} ngày</div>
                  </div>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={6}>
              <Card>
                <Space align='center'>
                  <AimOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
                  <div>
                    <div style={{ color: '#888' }}>Hoàn thành mục tiêu</div>
                    <div style={{ fontSize: 28, fontWeight: 700 }}>{goalsCompletion}%</div>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} style={{ marginTop: 16 }}>
            <Col xs={24} lg={12}>
              <Card title='Buổi tập theo tuần'>
                <ReactApexChart options={chartOptions} series={[{ name: 'Buổi tập', data: weeklyCount }]} type='bar' height={320} />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title='Cân nặng theo thời gian'>
                <ReactApexChart options={weightOptions} series={[{ name: 'Cân nặng', data: weightTrend }]} type='line' height={320} />
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} style={{ marginTop: 16 }}>
            <Col span={24}>
              <Card title='5 buổi tập gần nhất'>
                <Timeline>
                  {recentWorkouts.map((item) => (
                    <Timeline.Item key={item.id} color={item.status === 'Hoàn thành' ? 'green' : 'red'}>
                      <div style={{ fontWeight: 600 }}>{item.name}</div>
                      <div style={{ color: '#666' }}>{moment(item.date).format('DD/MM/YYYY')} · {item.type} · {item.duration} phút · {item.calories} cal</div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {activeTab === 'workout' && (
        <>
          <Row gutter={[24, 24]} style={{ marginBottom: 16 }}>
            <Col xs={24} lg={18}>
              <Space wrap>
                <Input.Search
                  placeholder='Tìm theo tên bài tập'
                  allowClear
                  onSearch={(value) => setWorkoutSearch(value)}
                  style={{ width: 260 }}
                />
                <Select
                  allowClear
                  placeholder='Lọc loại bài tập'
                  style={{ width: 180 }}
                  onChange={(value) => setWorkoutTypeFilter(value as string | null)}
                >
                  {workoutTypes.map((type) => (
                    <Select.Option key={type} value={type}>{type}</Select.Option>
                  ))}
                </Select>
                <RangePicker onChange={(dates) => setWorkoutDateRange(dates as any)} />
              </Space>
            </Col>
            <Col xs={24} lg={6} style={{ textAlign: 'right' }}>
              <Button type='primary' icon={<PlusOutlined />} onClick={() => {
                setEditingWorkout(null);
                workoutForm.resetFields();
                setIsWorkoutModalOpen(true);
              }}>
                Thêm buổi tập
              </Button>
            </Col>
          </Row>
          <Card>
            <Table<Workout>
              columns={workoutColumns}
              dataSource={filteredWorkouts}
              rowKey='id'
              pagination={{ pageSize: 6 }}
            />
          </Card>

          <Modal
            visible={isWorkoutModalOpen}
            title={editingWorkout ? 'Sửa buổi tập' : 'Thêm buổi tập'}
            onCancel={() => {
              setIsWorkoutModalOpen(false);
              setEditingWorkout(null);
            }}
            onOk={onSubmitWorkout}
            okText='Lưu'
            destroyOnClose
          >
            <Form form={workoutForm} layout='vertical'>
              <Form.Item name='date' label='Ngày tập' rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name='name' label='Tên bài tập' rules={[{ required: true, message: 'Nhập tên bài tập' }]}>
                <Input />
              </Form.Item>
              <Form.Item name='type' label='Loại bài tập' rules={[{ required: true }]}>
                <Select>
                  {workoutTypes.map((type) => (
                    <Select.Option value={type} key={type}>{type}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name='duration' label='Thời lượng (phút)' rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name='calories' label='Calo' rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name='status' label='Trạng thái' rules={[{ required: true }]}>
                <Select>
                  <Select.Option value='Hoàn thành'>Hoàn thành</Select.Option>
                  <Select.Option value='Bỏ lỡ'>Bỏ lỡ</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name='note' label='Ghi chú'>
                <TextArea rows={3} />
              </Form.Item>
            </Form>
          </Modal>
        </>
      )}

      {activeTab === 'health' && (
        <>
          <Row gutter={[24, 24]} style={{ marginBottom: 16 }}>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type='primary' icon={<PlusOutlined />} onClick={() => {
                setEditingHealth(null);
                healthForm.resetFields();
                setIsHealthModalOpen(true);
              }}>
                Thêm chỉ số sức khỏe
              </Button>
            </Col>
          </Row>
          <Card>
            <Table<HealthRecord>
              columns={healthColumns}
              dataSource={[...healthRecords].sort((a, b) => moment(b.date).unix() - moment(a.date).unix())}
              rowKey='id'
              pagination={{ pageSize: 8 }}
            />
          </Card>

          <Modal
            visible={isHealthModalOpen}
            title={editingHealth ? 'Sửa chỉ số sức khỏe' : 'Thêm chỉ số sức khỏe'}
            onCancel={() => {
              setIsHealthModalOpen(false);
              setEditingHealth(null);
            }}
            onOk={onSubmitHealth}
            okText='Lưu'
            destroyOnClose
          >
            <Form form={healthForm} layout='vertical'>
              <Form.Item name='date' label='Ngày' rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name='weight' label='Cân nặng (kg)' rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name='height' label='Chiều cao (cm)' rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name='heartRate' label='Nhịp tim nghỉ (bpm)' rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name='sleepHours' label='Giờ ngủ' rules={[{ required: true }]}>
                <InputNumber min={0} step={0.5} style={{ width: '100%' }} />
              </Form.Item>
            </Form>
          </Modal>
        </>
      )}

      {activeTab === 'goals' && (
        <>
          <Row gutter={[24, 24]} style={{ marginBottom: 16 }}>
            <Col xs={24} md={16}>
              <Segmented
                options={['Tất cả', 'Đang thực hiện', 'Đã đạt', 'Đã hủy']}
                value={goalStatusFilter}
                onChange={(value) => setGoalStatusFilter(value as any)}
              />
            </Col>
            <Col xs={24} md={8} style={{ textAlign: 'right' }}>
              <Button type='primary' icon={<PlusOutlined />} onClick={() => {
                setEditingGoal(null);
                goalForm.resetFields();
                setIsGoalDrawerOpen(true);
              }}>
                Thêm mục tiêu
              </Button>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            {filteredGoals.map((goal) => (
              <Col xs={24} md={12} lg={8} key={goal.id}>
                <Card
                  title={goal.name}
                  extra={
                    <Space>
                      <Button
                        type='text'
                        icon={<EditOutlined />}
                        onClick={() => {
                          setEditingGoal(goal);
                          goalForm.setFieldsValue({
                            ...goal,
                            deadline: moment(goal.deadline),
                          });
                          setIsGoalDrawerOpen(true);
                        }}
                      />
                      <Popconfirm
                        title='Xác nhận xóa mục tiêu này?'
                        onConfirm={() => setGoals(goals.filter((item) => item.id !== goal.id))}
                      >
                        <Button danger type='text' icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </Space>
                  }
                >
                  <Space direction='vertical' style={{ width: '100%' }}>
                    <Tag>{goal.type}</Tag>
                    <div>Giá trị mục tiêu: {goal.targetValue} {goal.unit}</div>
                    <div>
                      Giá trị hiện tại:{' '}
                      <InputNumber
                        min={0}
                        value={goal.currentValue}
                        onChange={(value) => {
                          const nextValue = Number(value || 0);
                          setGoals(goals.map((item) => (item.id === goal.id ? { ...item, currentValue: nextValue } : item)));
                        }}
                        style={{ width: 120 }}
                      /> {goal.unit}
                    </div>
                    <Progress percent={goalProgress(goal)} status={goal.status === 'Đã hủy' ? 'exception' : goal.status === 'Đã đạt' ? 'success' : 'active'} />
                    <div>Deadline: {moment(goal.deadline).format('DD/MM/YYYY')}</div>
                    <Tag color={goal.status === 'Đang thực hiện' ? 'blue' : goal.status === 'Đã đạt' ? 'green' : 'red'}>{goal.status}</Tag>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>

          <Drawer
            title={editingGoal ? 'Sửa mục tiêu' : 'Thêm mục tiêu'}
            width={520}
            placement='right'
            onClose={() => {
              setIsGoalDrawerOpen(false);
              setEditingGoal(null);
              goalForm.resetFields();
            }}
            visible={isGoalDrawerOpen}
          >
            <Form form={goalForm} layout='vertical' onFinish={handleGoalSubmit}>
              <Form.Item name='name' label='Tên mục tiêu' rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name='type' label='Loại mục tiêu' rules={[{ required: true }]}>
                <Select>
                  <Select.Option value='Giảm cân'>Giảm cân</Select.Option>
                  <Select.Option value='Tăng cơ'>Tăng cơ</Select.Option>
                  <Select.Option value='Cải thiện sức bền'>Cải thiện sức bền</Select.Option>
                  <Select.Option value='Khác'>Khác</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name='targetValue' label='Giá trị mục tiêu' rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name='currentValue' label='Giá trị hiện tại' rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name='unit' label='Đơn vị' rules={[{ required: true }]}>
                <Input placeholder='kg / cm / km / phần' />
              </Form.Item>
              <Form.Item name='deadline' label='Deadline' rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name='status' label='Trạng thái' rules={[{ required: true }]}>
                <Select>
                  <Select.Option value='Đang thực hiện'>Đang thực hiện</Select.Option>
                  <Select.Option value='Đã đạt'>Đã đạt</Select.Option>
                  <Select.Option value='Đã hủy'>Đã hủy</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type='primary' htmlType='submit'>Lưu mục tiêu</Button>
              </Form.Item>
            </Form>
          </Drawer>
        </>
      )}

      {activeTab === 'library' && (
        <>
          <Row gutter={[24, 24]} style={{ marginBottom: 16 }}>
            <Col xs={24} md={8}>
              <Input.Search
                placeholder='Tìm tên bài tập'
                allowClear
                onSearch={(value) => setExerciseSearch(value)}
              />
            </Col>
            <Col xs={24} md={8}>
              <Select allowClear placeholder='Nhóm cơ' style={{ width: '100%' }} onChange={(value) => setExerciseMuscleFilter(value as string | null)}>
                {muscleGroups.map((group) => (
                  <Select.Option key={group} value={group}>{group}</Select.Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} md={8}>
              <Select allowClear placeholder='Mức độ khó' style={{ width: '100%' }} onChange={(value) => setExerciseDifficultyFilter(value as string | null)}>
                {difficulties.map((level) => (
                  <Select.Option key={level} value={level}>{level}</Select.Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Row gutter={[24, 24]}> 
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type='primary' icon={<PlusOutlined />} onClick={() => {
                setEditingExercise(null);
                setIsExerciseModalOpen(true);
              }}>
                Thêm bài tập
              </Button>
            </Col>
          </Row>
          <Row gutter={[24, 24]} style={{ marginTop: 8 }}>
            {filteredExercises.map((exercise) => (
              <Col xs={24} sm={12} lg={8} key={exercise.id}>
                <Card
                  hoverable
                  title={exercise.name}
                  extra={<Tag color={exercise.difficulty === 'Khó' ? 'red' : exercise.difficulty === 'Trung bình' ? 'gold' : 'green'}>{exercise.difficulty}</Tag>}
                  onClick={() => {
                    setSelectedExercise(exercise);
                    setIsExerciseDetailOpen(true);
                  }}
                >
                  <div style={{ marginBottom: 12 }}><strong>Nhóm cơ:</strong> {exercise.muscle}</div>
                  <div style={{ marginBottom: 12 }}>{exercise.description}</div>
                  <div style={{ marginBottom: 12, color: '#555' }}>~{exercise.caloriesPerHour} cal/giờ</div>
                  <Space>
                    <Button size='small' icon={<EditOutlined />} onClick={(e) => { e.stopPropagation(); setEditingExercise(exercise); setIsExerciseModalOpen(true); }}>
                      Sửa
                    </Button>
                    <Popconfirm
                      title='Xác nhận xóa bài tập này?'
                      onConfirm={(e) => {
                        e?.stopPropagation();
                        setExercises(exercises.filter((item) => item.id !== exercise.id));
                      }}
                    >
                      <Button danger size='small' icon={<DeleteOutlined />} onClick={(e) => e.stopPropagation()}>
                        Xóa
                      </Button>
                    </Popconfirm>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>

          <Modal
            visible={isExerciseDetailOpen}
            title={selectedExercise?.name}
            footer={null}
            onCancel={() => setIsExerciseDetailOpen(false)}
          >
            <div style={{ marginBottom: 12 }}><strong>Nhóm cơ:</strong> {selectedExercise?.muscle}</div>
            <div style={{ marginBottom: 12 }}><strong>Mức độ khó:</strong> {selectedExercise?.difficulty}</div>
            <div style={{ marginBottom: 12 }}><strong>Mô tả:</strong> {selectedExercise?.description}</div>
            <div style={{ marginBottom: 12 }}><strong>Hướng dẫn:</strong> {selectedExercise?.instructions}</div>
            <div><strong>Calo:</strong> {selectedExercise?.caloriesPerHour} cal/giờ</div>
          </Modal>

          <Modal
            visible={isExerciseModalOpen}
            title={editingExercise ? 'Sửa bài tập' : 'Thêm bài tập'}
            onCancel={() => {
              setIsExerciseModalOpen(false);
              setEditingExercise(null);
            }}
            onOk={async () => {
              const form = exerciseFormRef.current;
              if (!form) return;
              const values = await form.validateFields();
              handleExerciseSubmit(values);
            }}
            okText='Lưu'
            destroyOnClose
          >
            <ExerciseForm
              exercise={editingExercise}
              onMount={(form) => { exerciseFormRef.current = form; }}
            />
          </Modal>
        </>
      )}
    </div>
  );
};

const ExerciseForm: React.FC<{
  exercise: Exercise | null;
  onMount: (form: any) => void;
}> = ({ exercise, onMount }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    onMount(form);
    if (exercise) {
      form.setFieldsValue(exercise);
    } else {
      form.resetFields();
    }
  }, [exercise, form, onMount]);

  return (
    <Form form={form} layout='vertical'>
      <Form.Item name='name' label='Tên bài tập' rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name='muscle' label='Nhóm cơ' rules={[{ required: true }]}>
        <Select>
          <Select.Option value='Chest'>Chest</Select.Option>
          <Select.Option value='Back'>Back</Select.Option>
          <Select.Option value='Legs'>Legs</Select.Option>
          <Select.Option value='Shoulders'>Shoulders</Select.Option>
          <Select.Option value='Arms'>Arms</Select.Option>
          <Select.Option value='Core'>Core</Select.Option>
          <Select.Option value='Full Body'>Full Body</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name='difficulty' label='Mức độ khó' rules={[{ required: true }]}>
        <Select>
          <Select.Option value='Dễ'>Dễ</Select.Option>
          <Select.Option value='Trung bình'>Trung bình</Select.Option>
          <Select.Option value='Khó'>Khó</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name='description' label='Mô tả' rules={[{ required: true }]}>
        <TextArea rows={3} />
      </Form.Item>
      <Form.Item name='instructions' label='Hướng dẫn' rules={[{ required: true }]}>
        <TextArea rows={3} />
      </Form.Item>
      <Form.Item name='caloriesPerHour' label='Calo đốt trung bình/giờ' rules={[{ required: true }]}>
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
    </Form>
  );
};

export default FitnessPage;
