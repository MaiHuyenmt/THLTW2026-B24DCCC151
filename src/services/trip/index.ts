import { request } from 'umi';
import { Destination, TripPlan } from '@/models/trip';

const STATIC_DESTINATIONS: Destination[] = [
  {
    id: '1',
    name: 'Vịnh Hạ Long',
    location: 'Quảng Ninh',
    type: 'beach',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=800',
    description: 'Kỳ quan thiên nhiên thế giới với hàng ngàn đảo đá vôi kỳ vĩ.',
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
    id: '2',
    name: 'Đà Lạt',
    location: 'Lâm Đồng',
    type: 'mountain',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&q=80&w=800',
    description: 'Thành phố ngàn hoa với khí hậu mát mẻ quanh năm.',
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
  {
    id: '3',
    name: 'Hội An',
    location: 'Quảng Nam',
    type: 'city',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1588014020301-63993eeaf362?auto=format&fit=crop&q=80&w=800',
    description: 'Phố cổ yên bình với những chiếc đèn lồng rực rỡ.',
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
    id: '4',
    name: 'Sapa',
    location: 'Lào Cai',
    type: 'mountain',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&q=80&w=800',
    description: 'Nơi có đỉnh Fansipan nóc nhà Đông Dương và ruộng bậc thang.',
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
];

// Initialize localStorage with static destinations if not already present
function initializeDestinations() {
  const stored = localStorage.getItem('destinations');
  if (!stored) {
    localStorage.setItem('destinations', JSON.stringify(STATIC_DESTINATIONS));
  }
}

export async function getDestinations(params?: {
  type?: string;
  minRating?: number;
  maxCost?: number;
}): Promise<Destination[]> {
  initializeDestinations();
  const stored = localStorage.getItem('destinations');
  let destinations = stored ? JSON.parse(stored) : STATIC_DESTINATIONS;
  
  if (params?.type) {
    destinations = destinations.filter((d: Destination) => d.type === params.type);
  }
  if (params && params.minRating !== undefined) {
    destinations = destinations.filter((d: Destination) => d.rating >= params.minRating!);
  }
  if (params && params.maxCost !== undefined) {
    destinations = destinations.filter((d: Destination) => {
      const totalCost = d.costs.food + d.costs.accommodation + d.costs.transportation;
      return totalCost <= params.maxCost!;
    });
  }
  
  return destinations;
}

export async function getDestination(id: string): Promise<Destination> {
  initializeDestinations();
  const stored = localStorage.getItem('destinations');
  const destinations = stored ? JSON.parse(stored) : STATIC_DESTINATIONS;
  const destination = destinations.find((d: Destination) => d.id === id);
  if (!destination) throw new Error('Destination not found');
  return destination;
}

export async function createDestination(data: Omit<Destination, 'id' | 'createdAt' | 'updatedAt'>): Promise<Destination> {
  initializeDestinations();
  const stored = localStorage.getItem('destinations');
  const destinations = stored ? JSON.parse(stored) : STATIC_DESTINATIONS;
  
  const newDestination: Destination = {
    ...data,
    id: `custom_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  destinations.push(newDestination);
  localStorage.setItem('destinations', JSON.stringify(destinations));
  return newDestination;
}

export async function updateDestination(id: string, data: Partial<Destination>): Promise<Destination> {
  initializeDestinations();
  const stored = localStorage.getItem('destinations');
  const destinations = stored ? JSON.parse(stored) : STATIC_DESTINATIONS;
  
  const index = destinations.findIndex((d: Destination) => d.id === id);
  if (index === -1) throw new Error('Destination not found');
  
  destinations[index] = {
    ...destinations[index],
    ...data,
    id: destinations[index].id,
    createdAt: destinations[index].createdAt,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem('destinations', JSON.stringify(destinations));
  return destinations[index];
}

export async function deleteDestination(id: string): Promise<void> {
  initializeDestinations();
  const stored = localStorage.getItem('destinations');
  const destinations = stored ? JSON.parse(stored) : STATIC_DESTINATIONS;
  
  const filtered = destinations.filter((d: Destination) => d.id !== id);
  localStorage.setItem('destinations', JSON.stringify(filtered));
}

export async function getTripPlans(userId: string): Promise<TripPlan[]> {
  return request('/api/trip-plans', {
    method: 'GET',
    params: { userId },
  });
}

export async function createTripPlan(data: Omit<TripPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<TripPlan> {
  return request('/api/trip-plans', {
    method: 'POST',
    data,
  });
}

export async function updateTripPlan(id: string, data: Partial<TripPlan>): Promise<TripPlan> {
  return request(`/api/trip-plans/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteTripPlan(id: string): Promise<void> {
  return request(`/api/trip-plans/${id}`, {
    method: 'DELETE',
  });
}