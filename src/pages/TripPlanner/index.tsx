import React, { useState, useEffect } from 'react';
import { Card, Button, List, DatePicker, Input, Modal, Select, message, Row, Col, Statistic, Empty, Alert } from 'antd';
import { PlusOutlined, DeleteOutlined, ClockCircleOutlined, CarOutlined, FilePdfOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getDestinations, createTripPlan, updateTripPlan } from '@/services/trip';
import { Destination, TripPlan, TripDestination } from '@/models/trip';
import moment from 'moment';
import styles from './index.less';

const { TextArea } = Input;

const TripPlanner: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [selectedDestinations, setSelectedDestinations] = useState<TripDestination[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentDestination, setCurrentDestination] = useState<Destination | null>(null);
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);
  const [notes, setNotes] = useState('');
  const [budgetLimit, setBudgetLimit] = useState(5000000);

  useEffect(() => {
    fetchDestinations();
    loadTripPlan();
    loadBudgetLimit();
  }, []);

  // Auto-save trip plan when selectedDestinations changes
  useEffect(() => {
    if (selectedDestinations.length > 0 || tripPlan) {
      const newPlan: TripPlan = {
        id: tripPlan?.id || `trip_${Date.now()}`,
        name: 'My Trip Plan',
        userId: 'user1',
        destinations: selectedDestinations,
        totalBudget: calculateTotalBudget(),
        totalDuration: calculateTotalDuration(),
        createdAt: tripPlan?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTripPlan(newPlan);
      localStorage.setItem('tripPlan', JSON.stringify(newPlan));
      // Dispatch event to notify other components about the update
      window.dispatchEvent(new CustomEvent('tripPlanUpdated', { detail: newPlan }));
    }
  }, [selectedDestinations]);

  const loadBudgetLimit = () => {
    const saved = localStorage.getItem('budgetManagement');
    if (saved) {
      const budget = JSON.parse(saved);
      setBudgetLimit(budget.limit || 5000000);
    }
  };

  const fetchDestinations = async () => {
    try {
      const data = await getDestinations();
      const validData = Array.isArray(data) ? data : [];
      setDestinations(validData);
    } catch (error) {
      setDestinations([]);
      message.error('Failed to load destinations');
    }
  };

  const loadTripPlan = () => {
    const saved = localStorage.getItem('tripPlan');
    if (saved) {
      const plan = JSON.parse(saved);
      setTripPlan(plan);
      setSelectedDestinations(Array.isArray(plan.destinations) ? plan.destinations : []);
    }
  };

  const saveTripPlan = async () => {
    const newPlan: Omit<TripPlan, 'id' | 'createdAt' | 'updatedAt'> = {
      name: 'My Trip Plan',
      userId: 'user1',
      destinations: selectedDestinations,
      totalBudget: calculateTotalBudget(),
      totalDuration: calculateTotalDuration(),
    };

    try {
      const result = tripPlan ? await updateTripPlan(tripPlan.id, { ...tripPlan, ...newPlan }) : await createTripPlan(newPlan);
      setTripPlan(result);
      localStorage.setItem('tripPlan', JSON.stringify(result));
      message.success(tripPlan ? 'Trip plan updated' : 'Trip plan saved');
    } catch (error) {
      message.error('Failed to save trip plan');
    }
  };

  const formatCurrency = (value: number) => value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });

  const calculateTotalBudget = () =>
    selectedDestinations.reduce((total, tripDest) => {
      const dest = destinations.find(d => d.id === tripDest.destinationId);
      return total + (dest ? dest.costs.food + dest.costs.accommodation + dest.costs.transportation : 0);
    }, 0);

  const calculateTotalDuration = () =>
    selectedDestinations.reduce((total, tripDest) => {
      const dest = destinations.find(d => d.id === tripDest.destinationId);
      return total + (dest?.visitDuration || 0);
    }, 0);

  const addDestination = () => {
    if (currentDestination && selectedDate) {
      const currentTotal = calculateTotalBudget();
      const destCost = currentDestination.costs.food + currentDestination.costs.accommodation + currentDestination.costs.transportation;
      const newTotal = currentTotal + destCost;

      if (newTotal > budgetLimit) {
        message.error(`Thêm điểm đến này sẽ vượt quá hạn mức ngân sách! Hiện tại: ${formatCurrency(currentTotal)}, Sẽ thành: ${formatCurrency(newTotal)}, Hạn mức: ${formatCurrency(budgetLimit)}`);
        return;
      }

      const newTripDest: TripDestination = {
        id: Date.now().toString(),
        destinationId: currentDestination.id,
        date: selectedDate.format('YYYY-MM-DD'),
        order: selectedDestinations.length,
        notes,
      };
      setSelectedDestinations([...selectedDestinations, newTripDest]);
      setIsModalVisible(false);
      setCurrentDestination(null);
      setSelectedDate(null);
      setNotes('');
      message.success('Đã thêm điểm đến vào lịch trình');
    }
  };

  const removeDestination = (id: string) => {
    setSelectedDestinations(selectedDestinations.filter(d => d.id !== id));
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(selectedDestinations);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSelectedDestinations(items.map((item, index) => ({ ...item, order: index })));
  };

  const getDestinationById = (id: string) => destinations.find(d => d.id === id);

  const exportPdf = () => {
    message.info('Tính năng xuất PDF đang được phát triển');
  };

  return (
    <div className={styles.tripPlanner}>
      <Card className={styles.tripHeader} bordered={false}>
        <div>
          <h2>Hành trình của bạn</h2>
          <p>Sắp xếp các điểm đến để có chuyến đi hoàn hảo nhất</p>
        </div>
      </Card>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card
            className={styles.planCard}
            title="Danh sách điểm đến"
            extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>Thêm điểm đến</Button>}
          >
            {selectedDestinations.length ? (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="destinations">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      <List
                        dataSource={selectedDestinations}
                        renderItem={(item, index) => {
                          const destination = getDestinationById(item.destinationId);
                          return (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                              {(provided) => (
                                <div
                                  className={styles.tripItem}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                >
                                  <div className={styles.tripItemIndex} {...provided.dragHandleProps}>{index + 1}</div>
                                  <div className={styles.tripItemBody}>
                                    <div className={styles.tripTitle}>{destination?.name}</div>
                                    <div className={styles.tripMeta}>
                                      <span><ClockCircleOutlined /> {destination?.visitDuration}h</span>
                                      <span><CarOutlined /> Di chuyển: ~45p</span>
                                    </div>
                                    <div className={styles.tripDate}>{item.date}</div>
                                  </div>
                                  <Button danger icon={<DeleteOutlined />} onClick={() => removeDestination(item.id)} />
                                </div>
                              )}
                            </Draggable>
                          );
                        }}
                      />
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <Empty description="Chưa có điểm đến nào" />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card className={styles.summaryCard} title="Tóm tắt chuyến đi">
            {(() => {
              const total = calculateTotalBudget();
              const remaining = budgetLimit - total;
              const percent = (total / budgetLimit) * 100;
              return (
                <>
                  {percent > 80 && (
                    <Alert
                      message="Cảnh báo ngân sách"
                      description={`Bạn đã sử dụng ${percent.toFixed(0)}% hạn mức ngân sách`}
                      type={percent > 100 ? 'error' : 'warning'}
                      style={{ marginBottom: 16 }}
                      showIcon
                    />
                  )}
                  <Statistic title="Số điểm đến" value={selectedDestinations.length} />
                  <Statistic title="Tổng thời gian" value={calculateTotalDuration()} suffix="giờ" style={{ marginTop: 20 }} />
                  <Statistic title="Tổng chi phí" value={formatCurrency(total)} style={{ marginTop: 20 }} />
                  <Statistic title="Còn lại" value={formatCurrency(Math.max(remaining, 0))} style={{ marginTop: 20, color: remaining < 0 ? 'red' : 'green' }} />
                </>
              );
            })()}
            <Button type="default" block style={{ marginTop: 24 }} onClick={saveTripPlan}>
              Lưu lịch trình
            </Button>
            <Button type="primary" icon={<FilePdfOutlined />} block style={{ marginTop: 16 }} onClick={exportPdf}>
              Xuất lịch trình (PDF)
            </Button>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Thêm điểm đến"
        visible={isModalVisible}
        onOk={addDestination}
        onCancel={() => setIsModalVisible(false)}
      >
        <Select
          placeholder="Chọn điểm đến"
          style={{ width: '100%', marginBottom: 16 }}
          onChange={(value) => setCurrentDestination(destinations.find(d => d.id === value) || null)}
          value={currentDestination?.id}
          allowClear
        >
          {destinations.map(dest => (
            <Select.Option key={dest.id} value={dest.id}>
              {dest.name} - {dest.location}
            </Select.Option>
          ))}
        </Select>
        <DatePicker
          placeholder="Chọn ngày"
          style={{ width: '100%', marginBottom: 16 }}
          onChange={(date) => setSelectedDate(date)}
          value={selectedDate}
        />
        <TextArea
          placeholder="Ghi chú"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default TripPlanner;
