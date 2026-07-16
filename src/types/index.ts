export type {
  UserRole,
  PartnerStatus,
  BookingStatus,
  PaymentStatus,
  Gender,
} from "@prisma/client";

export interface AuthUser {
  id: string;
  email: string | null;
  phone: string | null;
  name: string | null;
  avatarUrl: string | null;
  role: string;
  isVerified: boolean;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
}

export interface LoginInput {
  email?: string;
  phone?: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterInput {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  role?: string;
}

export interface OtpInput {
  phone?: string;
  email?: string;
  otp: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BookingWithDetails {
  id: string;
  customerId: string;
  partnerId: string;
  serviceType: string;
  bookingDate: Date;
  startTime: string;
  endTime: string | null;
  duration: number;
  totalAmount: number;
  discountAmount: number;
  couponCode: string | null;
  finalAmount: number;
  status: string;
  address: string | null;
  city: string | null;
  notes: string | null;
  cancelledBy: string | null;
  cancelReason: string | null;
  completedAt: Date | null;
  createdAt: Date;
  partner?: PartnerProfile;
  payment?: PaymentInfo;
  review?: ReviewInfo;
}

export interface PartnerProfile {
  id: string;
  userId: string;
  businessName: string | null;
  description: string | null;
  skills: string[];
  languages: string[];
  experience: number;
  hourlyPrice: number;
  workingRadius: number;
  isOnline: boolean;
  isAvailable: boolean;
  city: string | null;
  state: string | null;
  averageRating: number;
  totalReviews: number;
  totalBookings: number;
  completionRate: number;
  responseTime: number;
  user: {
    name: string | null;
    avatarUrl: string | null;
    email: string | null;
    phone: string | null;
  };
  documents?: PartnerDocument[];
  availability?: AvailabilitySlot[];
  gallery?: { url: string; caption: string | null }[];
  certificates?: { name: string; issuer: string; url: string | null }[];
}

export interface PartnerDocument {
  id: string;
  type: string;
  url: string;
  status: string;
}

export interface AvailabilitySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface PaymentInfo {
  id: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string | null;
  paidAt: Date | null;
}

export interface ReviewInfo {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  customer: {
    name: string | null;
    avatarUrl: string | null;
  };
}

export interface MessageData {
  id: string;
  bookingId: string;
  senderId: string;
  content: string | null;
  mediaUrl: string | null;
  mediaType: string | null;
  isRead: boolean;
  createdAt: Date;
  sender: {
    name: string | null;
    avatarUrl: string | null;
  };
}

export interface DashboardStats {
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalSpent: number;
  walletBalance: number;
  rewardPoints: number;
  savedPartners: number;
}

export interface PartnerDashboardStats {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalEarnings: number;
  pendingEarnings: number;
  withdrawnAmount: number;
  averageRating: number;
  totalReviews: number;
  completionRate: number;
  responseTime: number;
}

export interface AdminStats {
  totalUsers: number;
  totalPartners: number;
  verifiedPartners: number;
  totalBookings: number;
  totalRevenue: number;
  totalCommissions: number;
  pendingVerifications: number;
  openTickets: number;
}

export interface SearchFilters {
  city?: string;
  area?: string;
  distance?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  gender?: string;
  languages?: string[];
  availability?: string;
  minRating?: number;
  verified?: boolean;
  onlineNow?: boolean;
  minExperience?: number;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  isRead: boolean;
  createdAt: Date;
}

export interface CouponInfo {
  id: string;
  code: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  minAmount: number;
  maxDiscount: number | null;
  expiresAt: Date | null;
  isActive: boolean;
}

export interface WalletInfo {
  id: string;
  balance: number;
  transactions: {
    id: string;
    type: string;
    amount: number;
    balance: number;
    reference: string | null;
    createdAt: Date;
  }[];
}
