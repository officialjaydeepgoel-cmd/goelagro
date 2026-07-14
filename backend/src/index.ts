import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import { Server as SocketServer } from "socket.io";
import { config } from "@/config";
import { errorHandler, notFoundHandler } from "@/middleware/errorHandler";

// Import routes
import authRoutes from "@/routes/auth.routes";
import categoryRoutes from "@/routes/category.routes";
import productRoutes from "@/routes/product.routes";
import rfqRoutes from "@/routes/rfq.routes";
import orderRoutes from "@/routes/order.routes";
import marketPriceRoutes from "@/routes/market-price.routes";
import adminRoutes from "@/routes/admin.routes";
import aiRoutes from "@/routes/ai.routes";
import cmsRoutes from "@/routes/cms.routes";

const app = express();
app.set("trust proxy", 1);
const httpServer = createServer(app);

// Socket.IO
const io = new SocketServer(httpServer, {
  cors: {
    origin: [config.frontendUrl, config.frontendUrl + "/admin"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("join", (userId: string) => {
    socket.join(`user:${userId}`);
  });

  socket.on("sendMessage", (data: { chatId: string; message: string; receiverId: string }) => {
    io.to(`user:${data.receiverId}`).emit("newMessage", {
      chatId: data.chatId,
      message: data.message,
      senderId: socket.id,
    });
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Make io available to routes
app.set("io", io);

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
  origin: [config.frontendUrl],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many login attempts, please try again later." },
});

app.use("/api/v1/auth/login", authLimiter);
app.use("/api/v1/auth/register", authLimiter);
app.use("/api", limiter);

// Health check
app.get("/api/v1/health", (_req, res) => {
  res.json({
    success: true,
    message: "Goel Agro Global API is running",
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/rfqs", rfqRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/market-prices", marketPriceRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/cms", cmsRoutes);

// Swagger documentation placeholder
app.get("/api/v1/docs", (_req, res) => {
  res.json({
    success: true,
    message: "API Documentation",
    data: {
      version: "1.0.0",
      baseUrl: "/api/v1",
      endpoints: [
        { path: "/auth", methods: ["POST /register", "POST /login", "POST /refresh", "GET /me", "POST /logout", "POST /verify-otp"] },
        { path: "/categories", methods: ["GET /", "GET /:slug", "POST /"] },
        { path: "/products", methods: ["GET /", "GET /:slug", "POST /", "PUT /:id", "DELETE /:id"] },
        { path: "/rfqs", methods: ["GET /", "POST /", "GET /:id", "POST /:id/quote"] },
        { path: "/orders", methods: ["GET /", "GET /:id", "PUT /:id/status"] },
        { path: "/market-prices", methods: ["GET /", "GET /commodities", "POST /"] },
        { path: "/ai", methods: ["POST /chat", "POST /recommendations", "POST /generate-quotation", "POST /lead-score"] },
        { path: "/admin", methods: ["GET /dashboard", "GET /users", "PUT /users/:id", "GET /products/pending", "PUT /products/:id/approve", "GET /leads", "GET /settings", "PUT /settings", "GET /audit-logs"] },
        { path: "/cms", methods: ["GET/POST/PUT/DELETE /photos", "GET/POST/PUT/DELETE /media", "GET/POST/PUT/DELETE /blogs", "GET/POST/PUT/DELETE /menus", "GET/POST/PUT/DELETE /services", "GET/POST/PUT/DELETE /testimonials", "GET/POST/PUT/DELETE /banners", "GET/POST/PUT/DELETE /bookings"] },
      ],
    },
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
httpServer.listen(config.port, () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║  Goel Agro Global API Server                 ║
║  Port: ${config.port}                              ║
║  Env:  ${config.nodeEnv.padEnd(33)}║
║  URL:  http://localhost:${config.port}                ║
╚═══════════════════════════════════════════════╝
  `);
});

export { app, httpServer, io };
