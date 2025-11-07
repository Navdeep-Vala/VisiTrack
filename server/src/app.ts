import express from "express";
import morgan from "morgan";
import { corsConfig } from "./config/cors.config";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.config";
import authRoutes from "./routes/auth.routes";
import visitorRoutes from "./routes/visitor.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import userRoutes from "./routes/user.routes";
import notificationRoutes from "./routes/notification.routes";

const app = express();

// Middleware
app.use(corsConfig);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: "Too many requests from this IP, please try again later",
});

app.use("/api", limiter);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(notFound);
app.use(errorHandler);

// routes
app.use("/api/auth", authRoutes);

app.use(errorHandler);

export default app;
