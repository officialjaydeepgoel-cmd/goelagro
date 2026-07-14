const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refreshToken");
}

export function setTokens(accessToken: string, refreshToken?: string): void {
  localStorage.setItem("accessToken", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
}

export function clearTokens(): void {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function getStoredUser(): Record<string, unknown> | null {
  if (typeof window === "undefined") return null;
  const u = localStorage.getItem("user");
  return u ? JSON.parse(u) : null;
}

export function storeUser(user: Record<string, unknown>): void {
  localStorage.setItem("user", JSON.stringify(user));
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: refresh }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.accessToken) {
      setTokens(data.accessToken);
      return data.accessToken;
    }
    return null;
  } catch {
    return null;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (res.status === 401 && token) {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken();
    }
    const newToken = await refreshPromise;
    refreshPromise = null;

    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    } else {
      clearTokens();
      window.location.href = "/login";
      return { success: false, message: "Session expired" };
    }
  }

  const data = await res.json();
  return data;
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: "DELETE" }),

  auth: {
    login: (email: string, password: string) =>
      api.post<{ accessToken: string; refreshToken: string; user: Record<string, unknown> }>("/auth/login", { email, password }),
    register: (data: Record<string, unknown>) =>
      api.post("/auth/register", data),
    me: () => api.get("/auth/me"),
  },

  products: {
    list: (params?: Record<string, string>) => {
      const qs = params ? "?" + new URLSearchParams(params).toString() : "";
      return api.get<unknown[]>(`/products${qs}`);
    },
    get: (slug: string) => api.get(`/products/${slug}`),
    create: (data: Record<string, unknown>) => api.post("/products", data),
    update: (id: string, data: Record<string, unknown>) => api.put(`/products/${id}`, data),
    delete: (id: string) => api.delete(`/products/${id}`),
  },

  categories: {
    list: () => api.get("/categories"),
    get: (slug: string) => api.get(`/categories/${slug}`),
    create: (data: Record<string, unknown>) => api.post("/categories", data),
    update: (id: string, data: Record<string, unknown>) => api.put(`/categories/${id}`, data),
    delete: (id: string) => api.delete(`/categories/${id}`),
  },

  rfqs: {
    list: (params?: Record<string, string>) => {
      const qs = params ? "?" + new URLSearchParams(params).toString() : "";
      return api.get(`/rfqs${qs}`);
    },
    get: (id: string) => api.get(`/rfqs/${id}`),
    create: (data: Record<string, unknown>) => api.post("/rfqs", data),
    quote: (id: string, data: Record<string, unknown>) => api.post(`/rfqs/${id}/quote`, data),
  },

  orders: {
    list: (params?: Record<string, string>) => {
      const qs = params ? "?" + new URLSearchParams(params).toString() : "";
      return api.get(`/orders${qs}`);
    },
    get: (id: string) => api.get(`/orders/${id}`),
    updateStatus: (id: string, data: Record<string, unknown>) => api.put(`/orders/${id}/status`, data),
  },

  marketPrices: {
    list: (params?: Record<string, string>) => {
      const qs = params ? "?" + new URLSearchParams(params).toString() : "";
      return api.get(`/market-prices${qs}`);
    },
    commodities: () => api.get("/market-prices/commodities"),
  },

  admin: {
    dashboard: () => api.get("/admin/dashboard"),
    users: (params?: Record<string, string>) => {
      const qs = params ? "?" + new URLSearchParams(params).toString() : "";
      return api.get(`/admin/users${qs}`);
    },
    updateUser: (id: string, data: Record<string, unknown>) => api.put(`/admin/users/${id}`, data),
    pendingProducts: (params?: Record<string, string>) => {
      const qs = params ? "?" + new URLSearchParams(params).toString() : "";
      return api.get(`/admin/products/pending${qs}`);
    },
    approveProduct: (id: string, data: Record<string, unknown>) => api.put(`/admin/products/${id}/approve`, data),
    leads: (params?: Record<string, string>) => {
      const qs = params ? "?" + new URLSearchParams(params).toString() : "";
      return api.get(`/admin/leads${qs}`);
    },
    settings: () => api.get("/admin/settings"),
    updateSettings: (data: Record<string, unknown>) => api.put("/admin/settings", data),
    auditLogs: (params?: Record<string, string>) => {
      const qs = params ? "?" + new URLSearchParams(params).toString() : "";
      return api.get(`/admin/audit-logs${qs}`);
    },
  },

  cms: {
    photos: {
      list: () => api.get("/cms/photos"),
      create: (data: Record<string, unknown>) => api.post("/cms/photos", data),
      update: (id: string, data: Record<string, unknown>) => api.put(`/cms/photos/${id}`, data),
      delete: (id: string) => api.delete(`/cms/photos/${id}`),
    },
    media: {
      list: () => api.get("/cms/media"),
      create: (data: Record<string, unknown>) => api.post("/cms/media", data),
      update: (id: string, data: Record<string, unknown>) => api.put(`/cms/media/${id}`, data),
      delete: (id: string) => api.delete(`/cms/media/${id}`),
    },
    blogs: {
      list: () => api.get("/cms/blogs"),
      get: (id: string) => api.get(`/cms/blogs/${id}`),
      create: (data: Record<string, unknown>) => api.post("/cms/blogs", data),
      update: (id: string, data: Record<string, unknown>) => api.put(`/cms/blogs/${id}`, data),
      delete: (id: string) => api.delete(`/cms/blogs/${id}`),
    },
    menus: {
      list: () => api.get("/cms/menus"),
      create: (data: Record<string, unknown>) => api.post("/cms/menus", data),
      update: (id: string, data: Record<string, unknown>) => api.put(`/cms/menus/${id}`, data),
      delete: (id: string) => api.delete(`/cms/menus/${id}`),
    },
    services: {
      list: () => api.get("/cms/services"),
      create: (data: Record<string, unknown>) => api.post("/cms/services", data),
      update: (id: string, data: Record<string, unknown>) => api.put(`/cms/services/${id}`, data),
      delete: (id: string) => api.delete(`/cms/services/${id}`),
    },
    testimonials: {
      list: () => api.get("/cms/testimonials"),
      create: (data: Record<string, unknown>) => api.post("/cms/testimonials", data),
      update: (id: string, data: Record<string, unknown>) => api.put(`/cms/testimonials/${id}`, data),
      delete: (id: string) => api.delete(`/cms/testimonials/${id}`),
    },
    banners: {
      list: () => api.get("/cms/banners"),
      create: (data: Record<string, unknown>) => api.post("/cms/banners", data),
      update: (id: string, data: Record<string, unknown>) => api.put(`/cms/banners/${id}`, data),
      delete: (id: string) => api.delete(`/cms/banners/${id}`),
    },
    bookings: {
      list: () => api.get("/cms/bookings"),
      create: (data: Record<string, unknown>) => api.post("/cms/bookings", data),
      update: (id: string, data: Record<string, unknown>) => api.put(`/cms/bookings/${id}`, data),
      delete: (id: string) => api.delete(`/cms/bookings/${id}`),
    },
  },

  ai: {
    chat: (message: string) => api.post("/ai/chat", { message }),
    recommendations: (preferences?: string) => api.post("/ai/recommendations", { preferences }),
    generateQuotation: (data: Record<string, unknown>) => api.post("/ai/generate-quotation", data),
    leadScore: (data: Record<string, unknown>) => api.post("/ai/lead-score", data),
  },
};
