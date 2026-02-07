// 用户相关类型
export interface User {
  id: string
  phone: string
  nickname?: string
  avatar?: string
  bio?: string
  email?: string
  createdAt: Date
  updatedAt: Date
}

export interface UserWithRoles extends User {
  roles: Role[]
}

export interface Role {
  id: string
  name: string
  description?: string
}

// 认证相关类型
export interface LoginRequest {
  phone: string
  password?: string
  verificationCode?: string
  loginType: 'password' | 'code'
}

export interface RegisterRequest {
  phone: string
  password: string
  verificationCode: string
  nickname?: string
}

export interface AuthResponse {
  user: User
  token: string
}

// 博客相关类型
export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  coverImage?: string
  author: User
  category?: Category
  tags: Tag[]
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  isPinned: boolean
  viewCount: number
  likeCount: number
  commentCount: number
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface CreatePostRequest {
  title: string
  slug: string
  content: string
  excerpt?: string
  coverImage?: string
  categoryId?: string
  tagIds?: string[]
  status?: 'DRAFT' | 'PUBLISHED'
  publishedAt?: Date
}

export interface UpdatePostRequest extends Partial<CreatePostRequest> {
  id: string
}

// 分类和标签
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  type: 'POST' | 'PHOTO'
}

export interface Tag {
  id: string
  name: string
  slug: string
  color?: string
}

// 摄影作品相关类型
export interface Photo {
  id: string
  title: string
  description?: string
  imageUrl: string
  thumbnailUrl?: string
  width?: number
  height?: number
  author: User
  category?: Category
  tags: Tag[]
  location?: string
  takenAt?: Date
  exif?: PhotoExif
  viewCount: number
  likeCount: number
  downloadCount: number
  allowDownload: boolean
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  createdAt: Date
  updatedAt: Date
}

export interface PhotoExif {
  camera?: string
  lens?: string
  aperture?: string
  shutter?: string
  iso?: string
  focalLength?: string
}

export interface CreatePhotoRequest {
  title: string
  description?: string
  imageUrl: string
  thumbnailUrl?: string
  categoryId?: string
  tagIds?: string[]
  location?: string
  takenAt?: Date
  exif?: PhotoExif
  allowDownload?: boolean
}

// 产品相关类型
export interface Product {
  id: string
  name: string
  slug: string
  description: string
  features: string
  coverImage?: string
  demoVideo?: string
  demoImages: string[]
  useCases?: string
  techStack?: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  plans: ProductPlan[]
  createdAt: Date
  updatedAt: Date
}

export interface ProductPlan {
  id: string
  productId: string
  name: string
  description?: string
  price: number
  currency: string
  duration?: number
  durationUnit?: string
  features: string
  isPopular: boolean
}

export interface CreateProductRequest {
  name: string
  slug: string
  description: string
  features: string
  coverImage?: string
  demoVideo?: string
  demoImages?: string[]
  useCases?: string
  techStack?: string
}

// 评论相关类型
export interface Comment {
  id: string
  content: string
  author: User
  targetType: 'POST' | 'PHOTO' | 'PRODUCT'
  targetId: string
  parentId?: string
  replies?: Comment[]
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  likeCount: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateCommentRequest {
  content: string
  targetType: 'POST' | 'PHOTO' | 'PRODUCT'
  targetId: string
  parentId?: string
}

// 订单相关类型
export interface Order {
  id: string
  orderNo: string
  user: User
  product: Product
  plan: ProductPlan
  amount: number
  currency: string
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED' | 'EXPIRED'
  paymentMethod?: string
  paidAt?: Date
  expiredAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface CreateOrderRequest {
  productId: string
  planId: string
}

export interface Payment {
  id: string
  orderId: string
  paymentNo: string
  paymentMethod: string
  amount: number
  currency: string
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED'
  transactionId?: string
  paidAt?: Date
}

// 分页相关类型
export interface PaginationParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

// 统计相关类型
export interface DashboardStats {
  users: {
    total: number
    newToday: number
    newThisWeek: number
    newThisMonth: number
  }
  posts: {
    total: number
    published: number
    draft: number
  }
  photos: {
    total: number
    published: number
  }
  products: {
    total: number
    published: number
  }
  revenue: {
    total: number
    thisMonth: number
    donations: number
    subscriptions: number
  }
  traffic: {
    todayPV: number
    todayUV: number
    thisWeekPV: number
    thisWeekUV: number
  }
}

// 网站配置类型
export interface SiteConfig {
  siteName: string
  siteUrl: string
  siteDescription: string
  logo?: string
  favicon?: string
  socialLinks?: {
    wechat?: string
    weibo?: string
    github?: string
    twitter?: string
  }
  features: {
    enableComments: boolean
    enableDonations: boolean
    enableRegistration: boolean
    enableThirdPartyLogin: boolean
  }
  seo: {
    title: string
    description: string
    keywords: string[]
  }
}
