export interface Destination {
  id: string;
  name: string;
  description: string;
  image: string;
  location: string;
  type: 'beach' | 'mountain' | 'city' | 'other';
  rating: number;
  visitDuration: number; // hours
  visitTime?: string;
  price?: number;
  costs: {
    food: number;
    accommodation: number;
    transportation: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TripPlan {
  id: string;
  name: string;
  userId: string;
  destinations: TripDestination[];
  totalBudget: number;
  totalDuration: number;
  createdAt: string;
  updatedAt: string;
}

export interface TripDestination {
  id: string;
  destinationId: string;
  date: string;
  order: number;
  notes?: string;
}

export interface BudgetCategory {
  category: string;
  amount: number;
  percentage: number;
}