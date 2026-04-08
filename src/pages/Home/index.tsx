import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Input, Tag, Button, message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { Destination } from '@/models/trip';
import { getDestinations } from '@/services/trip';
import styles from './index.less';

const { Option } = Select;
const { Meta } = Card;

const Home: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
  const [filters, setFilters] = useState({
    type: '',
    search: '',
    sort: 'rating',
  });

  useEffect(() => {
    loadDestinations();
    // Reload destinations every 1 second to catch updates from Admin page
    const interval = setInterval(loadDestinations, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadDestinations = async () => {
    try {
      const data = await getDestinations();
      setDestinations(data);
    } catch (error) {
      message.error('Failed to load destinations');
    }
  };

  useEffect(() => {
    applyFilters();
  }, [filters, destinations]);

  const formatCurrency = (value: number) =>
    value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });

  const getTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      beach: 'Biển',
      mountain: 'Núi',
      city: 'Thành phố',
      other: 'Khác',
    };
    return map[type] || 'Khác';
  };

  const getDestinationPrice = (destination: Destination) =>
    destination.costs.food + destination.costs.accommodation + destination.costs.transportation;

  const applyFilters = () => {
    let filtered = destinations;

    if (filters.type) {
      filtered = filtered.filter(d => d.type === filters.type);
    }

    if (filters.search) {
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        d.location.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.sort === 'price-asc') {
      filtered = filtered.slice().sort((a, b) => getDestinationPrice(a) - getDestinationPrice(b));
    }

    if (filters.sort === 'price-desc') {
      filtered = filtered.slice().sort((a, b) => getDestinationPrice(b) - getDestinationPrice(a));
    }

    if (filters.sort === 'rating') {
      filtered = filtered.slice().sort((a, b) => b.rating - a.rating);
    }

    setFilteredDestinations(filtered);
  };

  const addToTripPlan = (destination: Destination) => {
    const stored = localStorage.getItem('tripPlan');
    const plan = stored ? JSON.parse(stored) : null;
    const existingDestinations = plan && Array.isArray(plan.destinations) ? plan.destinations : [];

    const alreadyAdded = existingDestinations.some((item: any) => item.destinationId === destination.id);
    if (alreadyAdded) {
      message.info('Điểm đến đã có trong lịch trình');
      return;
    }

    const newTripDestination = {
      id: `${destination.id}-${Date.now()}`,
      destinationId: destination.id,
      date: new Date().toISOString().slice(0, 10),
      order: existingDestinations.length,
      notes: '',
    };

    const updatedPlan = {
      ...plan,
      id: plan?.id || 'local-trip-plan',
      name: plan?.name || 'My Trip Plan',
      userId: plan?.userId || 'user1',
      destinations: [...existingDestinations, newTripDestination],
      totalBudget: 0,
      totalDuration: 0,
      createdAt: plan?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem('tripPlan', JSON.stringify(updatedPlan));
    message.success('Đã thêm vào lịch trình');
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={styles.home}>
      <Row gutter={[24, 24]} align="middle" className={styles.header}>
        <Col xs={24} md={12}>
          <div>
            <h1>Khám phá điểm đến</h1>
            <p className={styles.subtitle}>Chọn điểm đến phù hợp, lập kế hoạch và tạo chuyến đi hoàn hảo.</p>
          </div>
        </Col>
        <Col xs={24} md={12}>
          <div className={styles.filterGroup}>
            <Select
              value={filters.type}
              placeholder="Tất cả loại hình"
              onChange={(value) => handleFilterChange('type', value)}
              allowClear
            >
              <Option value="beach">Biển</Option>
              <Option value="mountain">Núi</Option>
              <Option value="city">Thành phố</Option>
              <Option value="other">Khác</Option>
            </Select>
            <Select
              value={filters.sort}
              onChange={(value) => handleFilterChange('sort', value)}
            >
              <Option value="rating">Đánh giá cao nhất</Option>
              <Option value="price-asc">Giá thấp đến cao</Option>
              <Option value="price-desc">Giá cao đến thấp</Option>
            </Select>
            <Input
              placeholder="Tìm kiếm điểm đến..."
              prefix={<SearchOutlined />}
              allowClear
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {filteredDestinations.map(destination => (
          <Col xs={24} sm={12} lg={8} xl={6} key={destination.id}>
            <Card
              hoverable
              className={styles.destinationCard}
              cover={
                <div className={styles.cardCover}>
                  <img alt={destination.name} src={destination.image} />
                  <Tag className={styles.cardTag}>{getTypeLabel(destination.type)}</Tag>
                  <div className={styles.ratingBadge}>⭐ {destination.rating.toFixed(1)}</div>
                </div>
              }
            >
              <Meta
                title={destination.name}
                description={
                  <div className={styles.cardContent}>
                    <div className={styles.location}>{destination.location}</div>
                    <div className={styles.cardText}>{destination.description}</div>
                    {destination.visitTime && <div className={styles.visitTime}>Thời gian: {destination.visitTime}</div>}
                    {destination.price && <div className={styles.startingPrice}>Giá từ {formatCurrency(destination.price)}</div>}
                    <div className={styles.priceBlock}>
                      <div>
                        <div className={styles.price}>{formatCurrency(getDestinationPrice(destination))}</div>
                        <div className={styles.priceLabel}>ƯỚC TÍNH</div>
                      </div>
                      <Button className={styles.addButton} icon={<PlusOutlined />} onClick={() => addToTripPlan(destination)}>Thêm vào lịch trình</Button>
                    </div>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Home;
