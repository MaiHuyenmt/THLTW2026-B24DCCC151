const destinations = [
  {
    id: '1',
    name: 'Bãi biển Mỹ Khê',
    description: 'Bãi biển đẹp nhất Việt Nam với cát trắng mịn.',
    image: 'https://picsum.photos/seed/mykhe/800/500',
    location: 'Đà Nẵng',
    type: 'beach',
    rating: 5,
    visitDuration: 4,
    costs: {
      food: 500000,
      accommodation: 1000000,
      transportation: 200000,
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Fansipan',
    description: 'Nóc nhà Đông Dương với khung cảnh tuyệt đẹp.',
    image: 'https://picsum.photos/seed/fansipan/800/500',
    location: 'Lào Cai',
    type: 'mountain',
    rating: 4,
    visitDuration: 8,
    costs: {
      food: 300000,
      accommodation: 800000,
      transportation: 500000,
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Hồ Hoàn Kiếm',
    description: 'Trái tim của Hà Nội với đền Ngọc Sơn.',
    image: 'https://picsum.photos/seed/hoankiem/800/500',
    location: 'Hà Nội',
    type: 'city',
    rating: 4,
    visitDuration: 2,
    costs: {
      food: 200000,
      accommodation: 600000,
      transportation: 100000,
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'Hội An',
    description: 'Phố cổ yên bình với những chiếc đèn lồng rực rỡ.',
    image: 'https://images.unsplash.com/photo-1588014020301-63993eeaf362?auto=format&fit=crop&q=80&w=800',
    location: 'Quảng Nam',
    type: 'city',
    rating: 4.9,
    visitDuration: 48,
    visitTime: '2 ngày',
    price: 900000,
    costs: {
      food: 300000,
      accommodation: 500000,
      transportation: 100000,
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '5',
    name: 'Mũi Né',
    description: 'Thành phố biển nổi tiếng với cồn cát và gió mát.',
    image: 'https://picsum.photos/seed/muine/800/500',
    location: 'Bình Thuận',
    type: 'beach',
    rating: 4,
    visitDuration: 6,
    costs: {
      food: 400000,
      accommodation: 900000,
      transportation: 250000,
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '6',
    name: 'Sapa',
    description: 'Nơi có đỉnh Fansipan nóc nhà Đông Dương và ruộng bậc thang.',
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&q=80&w=800',
    location: 'Lào Cai',
    type: 'mountain',
    rating: 4.7,
    visitDuration: 84,
    visitTime: '3-4 ngày',
    price: 1800000,
    costs: {
      food: 450000,
      accommodation: 950000,
      transportation: 400000,
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '7',
    name: 'Vịnh Hạ Long',
    description: 'Kỳ quan thiên nhiên thế giới với hàng ngàn đảo đá vôi kỳ vĩ.',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=800',
    location: 'Quảng Ninh',
    type: 'beach',
    rating: 4.8,
    visitDuration: 72,
    visitTime: '2-3 ngày',
    price: 1500000,
    costs: {
      food: 500000,
      accommodation: 700000,
      transportation: 300000,
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '8',
    name: 'Đà Lạt',
    description: 'Thành phố ngàn hoa với khí hậu mát mẻ quanh năm.',
    image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&q=80&w=800',
    location: 'Lâm Đồng',
    type: 'mountain',
    rating: 4.6,
    visitDuration: 72,
    visitTime: '3 ngày',
    price: 1200000,
    costs: {
      food: 400000,
      accommodation: 600000,
      transportation: 200000,
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
];

export default {
  'GET /api/destinations': (req: any, res: any) => {
    const { type, minRating } = req.query;
    let filtered = destinations;

    if (type) {
      filtered = filtered.filter(d => d.type === type);
    }

    if (minRating) {
      filtered = filtered.filter(d => d.rating >= parseInt(minRating));
    }

    res.json(filtered);
  },

  'GET /api/destinations/:id': (req: any, res: any) => {
    const { id } = req.params;
    const destination = destinations.find(d => d.id === id);
    if (destination) {
      res.json(destination);
    } else {
      res.status(404).json({ error: 'Destination not found' });
    }
  },

  'POST /api/destinations': (req: any, res: any) => {
    const newDestination = {
      ...req.body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    destinations.push(newDestination);
    res.json(newDestination);
  },

  'PUT /api/destinations/:id': (req: any, res: any) => {
    const { id } = req.params;
    const index = destinations.findIndex(d => d.id === id);
    if (index !== -1) {
      destinations[index] = {
        ...destinations[index],
        ...req.body,
        updatedAt: new Date().toISOString(),
      };
      res.json(destinations[index]);
    } else {
      res.status(404).json({ error: 'Destination not found' });
    }
  },

  'DELETE /api/destinations/:id': (req: any, res: any) => {
    const { id } = req.params;
    const index = destinations.findIndex(d => d.id === id);
    if (index !== -1) {
      destinations.splice(index, 1);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Destination not found' });
    }
  },

  'GET /api/trip-plans': (req: any, res: any) => {
    // Mock trip plans - in real app, this would come from database
    res.json([]);
  },

  'POST /api/trip-plans': (req: any, res: any) => {
    const newTripPlan = {
      ...req.body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    res.json(newTripPlan);
  },

  'PUT /api/trip-plans/:id': (req: any, res: any) => {
    const updatedTripPlan = {
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    res.json(updatedTripPlan);
  },

  'DELETE /api/trip-plans/:id': (req: any, res: any) => {
    res.json({ success: true });
  },
};