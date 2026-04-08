import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Progress, InputNumber, message } from 'antd';
import { WarningOutlined, CoffeeOutlined, HomeOutlined, CarOutlined, DollarOutlined } from '@ant-design/icons';
import styles from './index.less';

interface BudgetCategoryItem {
  category: string;
  amount: number;
  color: string;
  icon: React.ReactNode;
}

const defaultCategories: BudgetCategoryItem[] = [
  { category: 'Ăn uống', amount: 500000, color: '#fa8c16', icon: <CoffeeOutlined /> },
  { category: 'Di chuyển', amount: 300000, color: '#1890ff', icon: <CarOutlined /> },
  { category: 'Lưu trú', amount: 700000, color: '#722ed1', icon: <HomeOutlined /> },
];

const BudgetManagement: React.FC = () => {
  const [limit, setLimit] = useState(5000000);
  const [categories, setCategories] = useState<BudgetCategoryItem[]>(defaultCategories);
  const [tripPlanDestinations, setTripPlanDestinations] = useState<any[]>([]);
  const [allDestinations, setAllDestinations] = useState<any[]>([]);

  // Load budget limit from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('budgetManagement');
    if (stored) {
      const budgetData = JSON.parse(stored);
      if (budgetData.limit) {
        setLimit(budgetData.limit);
      }
    }
  }, []);

  // Calculate spending from trip plan destinations
  const updateSpendingFromTripPlan = () => {
    const tripPlanStored = localStorage.getItem('tripPlan');
    if (tripPlanStored) {
      try {
        const tripPlan = JSON.parse(tripPlanStored);
        const destinations = Array.isArray(tripPlan?.destinations) ? tripPlan.destinations : [];
        
        let foodSpent = 0;
        let accommodationSpent = 0;
        let transportationSpent = 0;
        
        destinations.forEach((destination: any) => {
          const costs = destination.costs || { food: 0, accommodation: 0, transportation: 0 };
          foodSpent += Number(costs.food || 0);
          accommodationSpent += Number(costs.accommodation || 0);
          transportationSpent += Number(costs.transportation || 0);
        });
        
        const updatedCategories: BudgetCategoryItem[] = [
          { category: 'Ăn uống', amount: foodSpent, color: '#fa8c16', icon: <CoffeeOutlined /> },
          { category: 'Di chuyển', amount: transportationSpent, color: '#1890ff', icon: <CarOutlined /> },
          { category: 'Lưu trú', amount: accommodationSpent, color: '#722ed1', icon: <HomeOutlined /> },
        ];
        
        setCategories(updatedCategories);
      } catch (error) {
        console.error('Error parsing trip plan:', error);
      }
    }
  };

  // Load spending on mount
  useEffect(() => {
    updateSpendingFromTripPlan();
  }, []);

  // Listen to localStorage changes from other tabs/windows and from tripPlan updates
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tripPlan') {
        updateSpendingFromTripPlan();
      }
    };
    
    // Also listen to custom event from TripPlanner
    const handleCustomUpdate = () => {
      updateSpendingFromTripPlan();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('tripPlanUpdated', handleCustomUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tripPlanUpdated', handleCustomUpdate);
    };
  }, []);

  // Load all destinations and trip plan data
  useEffect(() => {
    const loadDestinationsAndTripPlan = async () => {
      try {
        // Load destinations
        const destinationsStored = localStorage.getItem('destinations');
        if (destinationsStored) {
          const dests = JSON.parse(destinationsStored);
          setAllDestinations(dests);
        }
        
        // Load trip plan
        const tripPlanStored = localStorage.getItem('tripPlan');
        if (tripPlanStored) {
          const tripPlan = JSON.parse(tripPlanStored);
          const destinations = Array.isArray(tripPlan?.destinations) ? tripPlan.destinations : [];
          
          // Enrich destinations with full data
          const enrichedDestinations = destinations.map((tripDest: any) => {
            const fullDest = allDestinations.find((d: any) => d.id === tripDest.destinationId) || {};
            return {
              ...tripDest,
              ...fullDest,
            };
          });
          
          setTripPlanDestinations(enrichedDestinations);
        }
      } catch (error) {
        console.error('Error loading destinations and trip plan:', error);
      }
    };
    
    loadDestinationsAndTripPlan();
  }, [allDestinations]);

  useEffect(() => {
    localStorage.setItem('budgetManagement', JSON.stringify({ limit, categories }));
  }, [limit, categories]);

  const totalSpent = categories.reduce((sum, item) => sum + item.amount, 0);
  const remaining = limit - totalSpent;
  const percentUsed = Math.round((totalSpent / limit) * 100);
  const isOverBudget = remaining < 0;

  const formatCurrency = (value: number) =>
    value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });

  const updateCategory = (category: string, amount: number) => {
    const updated = categories.map(item =>
      item.category === category ? { ...item, amount } : item
    );
    setCategories(updated);
    message.success('Ngân sách đã được cập nhật');
  };

  return (
    <div className={styles.budgetManagement}>
      <Card className={styles.headerCard} bordered={false}>
        <Row align="middle" gutter={[24, 24]}>
          <Col xs={24} md={16}>
            <h2>
              <DollarOutlined style={{ marginRight: 10, color: '#1890ff' }} /> Quản lý ngân sách
            </h2>
            <p>Theo dõi chi tiêu cho chuyến đi sắp tới và kiểm soát ngân sách hiệu quả.</p>
          </Col>
          <Col xs={24} md={8} className={styles.limitBox}>
            <div className={styles.limitLabel}>Hạn mức</div>
            <InputNumber
              min={0}
              value={limit}
              onChange={(value) => setLimit(value || 0)}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => Number(value?.replace(/\$|\,/g, '') || 0)}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
      </Card>

      <Card className={styles.progressCard} bordered={false}>
        <div className={styles.progressTitle}>
          <div>
            <div className={styles.progressLabel}>Tiến độ ngân sách</div>
            <div className={styles.progressValue}>{formatCurrency(totalSpent)} / {formatCurrency(limit)}</div>
          </div>
          <div className={styles.progressPercent}>{percentUsed}%</div>
        </div>
        <Progress percent={Math.min(percentUsed, 100)} status={isOverBudget ? 'exception' : 'active'} showInfo={false} />
        {isOverBudget && (
          <div className={styles.alertRow}>
            <WarningOutlined />
            <span>Bạn đã chi tiêu vượt quá hạn mức ngân sách.</span>
          </div>
        )}
      </Card>

      <Row gutter={[24, 24]} className={styles.categoryRow}>
        {categories.map(item => {
          const percent = Math.round((item.amount / limit) * 100);
          return (
            <Col xs={24} sm={12} lg={8} key={item.category}>
              <Card className={styles.categoryCard} bodyStyle={{ padding: '20px' }}>
                <div className={styles.categoryIcon} style={{ backgroundColor: item.color }}>
                  {item.icon}
                </div>
                <div className={styles.categoryInfo}>
                  <div className={styles.categoryName}>{item.category}</div>
                  <div className={styles.categoryAmount}>{formatCurrency(item.amount)}</div>
                </div>
                <Progress percent={percent} strokeColor={item.color} />
              </Card>
            </Col>
          );
        })}
      </Row>

      <Card className={styles.detailCard} title="Chi tiết từng hạng mục">
        <div className={styles.detailTable}>
          <div className={styles.detailHeader}>
            <div>Hạng mục</div>
            <div>Số tiền</div>
            <div>Phần trăm</div>
          </div>
          {categories.map(item => {
            const percent = ((item.amount / totalSpent) * 100) || 0;
            return (
              <div className={styles.detailRow} key={item.category}>
                <div>{item.category}</div>
                <div>
                  <InputNumber
                    min={0}
                    value={item.amount}
                    onChange={(value) => updateCategory(item.category, value || 0)}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => Number(value?.replace(/\$|\,/g, '') || 0)}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>{percent.toFixed(1)}%</div>
              </div>
            );
          })}
          <div className={styles.detailTotal}>
            <div>Tổng cộng</div>
            <div>{formatCurrency(totalSpent)}</div>
            <div>100%</div>
          </div>
        </div>
      </Card>

      {tripPlanDestinations.length > 0 && (
        <Card 
          className={styles.detailCard} 
          title="Lịch trình đã lưu" 
          style={{ marginTop: 24 }}
          bordered={false}
        >
          <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#fafafa', borderRadius: '4px' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Số điểm đến</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>{tripPlanDestinations.length}</div>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#fafafa', borderRadius: '4px' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Tổng chi phí</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fa8c16' }}>
                  {formatCurrency(totalSpent)}
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#fafafa', borderRadius: '4px' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Hạn mức</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
                  {formatCurrency(limit)}
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#fafafa', borderRadius: '4px' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                  {totalSpent > limit ? 'Vượt' : 'Còn lại'}
                </div>
                <div style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold', 
                  color: totalSpent > limit ? '#ff4d4f' : '#52c41a' 
                }}>
                  {formatCurrency(Math.abs(limit - totalSpent))}
                </div>
              </div>
            </Col>
          </Row>

          {totalSpent > limit && (
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24}>
                <Card 
                  style={{ 
                    backgroundColor: '#fff7e6', 
                    borderColor: '#ffa940',
                    padding: '12px 16px'
                  }}
                >
                  <Row align="middle" gutter={16}>
                    <Col flex="auto">
                      <WarningOutlined style={{ color: '#fa8c16', marginRight: 8 }} />
                      <span style={{ color: '#d46b08', fontWeight: '500' }}>
                        Lịch trình hiện tại đã vượt quá hạn mức ngân sách {formatCurrency(totalSpent - limit)}
                      </span>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          )}

          <div className={styles.detailTable} style={{ marginTop: 16 }}>
            <div className={styles.detailHeader}>
              <div>Điểm đến</div>
              <div>Ăn uống</div>
              <div>Lưu trú</div>
              <div>Di chuyển</div>
              <div>Tổng cộng</div>
            </div>
            {tripPlanDestinations.map((dest: any, index: number) => {
              const food = Number(dest.costs?.food || 0);
              const accommodation = Number(dest.costs?.accommodation || 0);
              const transportation = Number(dest.costs?.transportation || 0);
              const total = food + accommodation + transportation;
              return (
                <div className={styles.detailRow} key={index}>
                  <div style={{ fontWeight: '500' }}>{dest.name || 'N/A'}</div>
                  <div>{formatCurrency(food)}</div>
                  <div>{formatCurrency(accommodation)}</div>
                  <div>{formatCurrency(transportation)}</div>
                  <div style={{ fontWeight: '500', color: '#1890ff' }}>{formatCurrency(total)}</div>
                </div>
              );
            })}
            <div className={styles.detailTotal}>
              <div>Tổng cộng</div>
              <div>{formatCurrency(categories.find(c => c.category === 'Ăn uống')?.amount || 0)}</div>
              <div>{formatCurrency(categories.find(c => c.category === 'Lưu trú')?.amount || 0)}</div>
              <div>{formatCurrency(categories.find(c => c.category === 'Di chuyển')?.amount || 0)}</div>
              <div style={{ color: totalSpent > limit ? '#ff4d4f' : '#52c41a' }}>
                {formatCurrency(totalSpent)}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default BudgetManagement;
