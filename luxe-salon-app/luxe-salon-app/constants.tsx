
import { Service, Stylist, Outlet } from './types';

export const MOCK_SERVICES: Service[] = [
  { id: '1', name: 'Premium Haircut', price: 45.00, duration: 45 },
  { id: '2', name: 'Hair Wash & Styling', price: 30.00, duration: 30 },
  { id: '3', name: 'Full Color Treatment', price: 120.00, duration: 120 },
  { id: '4', name: 'Scalp Therapy', price: 65.00, duration: 60 },
  { id: '5', name: 'Beard Grooming', price: 25.00, duration: 20 },
];

export const MOCK_STYLISTS: Stylist[] = [
  {
    id: 's1',
    name: 'Alexander V.',
    title: 'Senior Creative Director',
    bio: 'Over 12 years of experience in luxury hair styling and color theory.',
    photo: 'https://picsum.photos/seed/alex/400/400',
    availableSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
  },
  {
    id: 's2',
    name: 'Sophia Chen',
    title: 'Expert Colorist',
    bio: 'Specializing in balayage and contemporary color techniques.',
    photo: 'https://picsum.photos/seed/sophia/400/400',
    availableSlots: ['09:30', '10:30', '13:30', '14:30', '15:30']
  },
  {
    id: 's3',
    name: 'Marcus Thorne',
    title: 'Master Barber',
    bio: 'Precision cutting and traditional grooming specialist.',
    photo: 'https://picsum.photos/seed/marcus/400/400',
    availableSlots: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']
  }
];

export const MOCK_OUTLETS: Outlet[] = [
  {
    id: 'o1',
    name: 'LuxeSalon Downtown',
    address: '123 Fashion Ave, Metropolitan City, 10001',
    contact: '+1 234 567 890',
    photo: 'https://picsum.photos/seed/salon1/800/400'
  },
  {
    id: 'o2',
    name: 'LuxeSalon Riverside',
    address: '456 Water St, Metro North, 10025',
    contact: '+1 987 654 321',
    photo: 'https://picsum.photos/seed/salon2/800/400'
  }
];

export const BANNER_IMAGE = 'https://picsum.photos/seed/banner/1200/400';
