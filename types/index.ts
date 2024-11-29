import * as z from 'zod';
import { Room, RoomType, Transaction, Guest } from '@prisma/client';

// Prisma Schema Modifications
export type RoomWithType = Room & {
  type: RoomType;
};

export type TransactionsWithGuestAndRoom = Transaction & {
  guest: Guest;
  room: Room;
};

// CUSTOM TYPES
export enum POSITION {
  HOUSEKEEPING = 'HOUSEKEEPING',
  FRONT_DESK = 'FRONT_DESK',
  MAINTENANCE = 'MAINTENANCE',
  MANAGEMENT = 'MANAGEMENT',
  BELLHOP = 'BELLHOP',
  FOOD_AND_BEVERAGE = 'FOOD_AND_BEVERAGE',
  CHEF = 'CHEF',
  SECURITY = 'SECURITY',
  EVENT_PLANNING = 'EVENT_PLANNING',
  VALET = 'VALET',
  LAUNDRY = 'LAUNDRY',
  GUEST_RELATIONS = 'GUEST_RELATIONS',
  DEFAULT = '',
}

export interface User {
  id: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null | undefined;
  imageUrl: string | undefined;
  email: string | undefined;
  position: POSITION;
  role: 'org:admin' | 'org:member';
  orgId: string;
}

export type TransactionFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  identityNo?: string;
  dob?: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
};

export interface UpdateGuestData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  identityNo?: string;
  imageUrl?: string;
}

export interface CreateTransactionData {
  startDate: Date;
  endDate: Date;
}

// ZOD SCHEMA
export const roomeTypeSchema = z.object({
  name: z.string().min(1, 'Room type name is required'),
  description: z.string().optional(),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  price: z.number().min(0, 'Price must be non-negative'),
  amenities: z.array(z.string()).min(1, 'At least one amenity is required'),
});

export const roomSchema = z.object({
  roomNumber: z.string().min(1, 'Room number is required'),
  floor: z.number().min(1, 'Floor must be at least 1'),
  status: z.enum(['READY', 'MAINTENANCE', 'CLEANING']),
  imageUrl: z.string().url('Invalid URL'),
  roomTypeId: z.string().min(1, 'Room type is required'),
});

export const updateStaffSchema = z.object({
  id: z.string(),
  username: z.string().optional(),
  password: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(['org:admin', 'org:member']).optional(),
  position: z.enum(Object.values(POSITION) as [string, ...string[]]).optional(),
  organizationId: z.string(),
});

export const createdStaffSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  username: z.string().min(3).max(50).optional(),
  password: z.string().min(8).max(100),
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  role: z.enum(['org:admin', 'org:member']).optional(),
  position: z.enum(Object.values(POSITION) as [string, ...string[]]).optional(),
});

export const createGuestSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  address: z.string().optional(),
  identityNo: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

export const createTransactionSchema = z.object({
  guestId: z.string().min(1, 'Guest is required'),
  roomId: z.string().min(1, 'Room is required'),
  checkIn: z.date({ required_error: 'Check-in date is required' }),
  checkOut: z.date({ required_error: 'Check-out date is required' }),
  totalPrice: z.number().min(0, 'Total price must be non-negative'),
  staffId: z.string().min(1, 'Staff ID is required'),
});

// ZOD TYPES EXPORT
export type RoomTypeSchema = z.infer<typeof roomeTypeSchema>;
export type RoomSchema = z.infer<typeof roomSchema>;
export type UpdateStaffSchema = z.infer<typeof updateStaffSchema>;
export type CreatedStaffSchema = z.infer<typeof createdStaffSchema>;
export type CreateGuestSchema = z.infer<typeof createGuestSchema>;
export type CreateTransactionSchema = z.infer<typeof createTransactionSchema>;
