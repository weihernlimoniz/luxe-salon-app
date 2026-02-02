
import { Service, Stylist, Outlet } from './types';

export const MOCK_SERVICES: Service[] = [
  { id: '1', name: 'Premium Cut & Wash', price: 45.00, duration: 45 },
  { id: '2', name: 'Perm', price: 280.00, duration: 150 },
  { id: '3', name: 'Rebonding', price: 200.00, duration: 180 },
  { id: '4', name: 'Colour', price: 150.00, duration: 90 },
  { id: '5', name: 'Scalp & Treatment', price: 100.00, duration: 60 },
];

export const MOCK_STYLISTS: Stylist[] = [
  {
    id: 's1',
    name: 'Jonathan',
    title: 'Creative Director',
    bio: 'Precision cutting and master vision for modern styles.',
    photo: 'https://picsum.photos/seed/jonathan/400/400',
    availableSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
  },
  {
    id: 's2',
    name: 'Alice',
    title: 'Senior Stylist',
    bio: 'Expert in chemical treatments and contemporary coloring.',
    photo: 'https://picsum.photos/seed/alice/400/400',
    availableSlots: ['09:30', '10:30', '13:30', '14:30', '15:30']
  },
  {
    id: 's3',
    name: 'TuTu',
    title: 'Stylist',
    bio: 'Dynamic stylist focused on trendy cuts and scalp health.',
    photo: 'https://picsum.photos/seed/tutu/400/400',
    availableSlots: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']
  }
];

export const MOCK_OUTLETS: Outlet[] = [
  {
    id: 'o1',
    name: 'Oviss Salon - Puchong',
    address: '123, Jalan Puchong, 45000 Selangor',
    contact: '012-3456789',
    photo: 'https://picsum.photos/seed/oviss1/800/400'
  },
  {
    id: 'o2',
    name: 'Oviss Salon - Melaka',
    address: '789, Jalan Tun Tuan, 75300 Melaka',
    contact: '019-6789012',
    photo: 'https://picsum.photos/seed/oviss2/800/400'
  }
];

export const BANNER_IMAGE = 'https://picsum.photos/seed/ovissbanner/1200/400';
