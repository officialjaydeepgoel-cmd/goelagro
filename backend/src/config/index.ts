import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "4000"),
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || "dev-access-secret-change-in-production",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "dev-refresh-secret-change-in-production",
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },

  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  },

  smtp: {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    from: process.env.EMAIL_FROM || "noreply@buddyverse.ai",
  },

  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || "",
    authToken: process.env.TWILIO_AUTH_TOKEN || "",
    whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER || "",
    smsNumber: process.env.TWILIO_SMS_NUMBER || "",
  },

  openai: {
    apiKey: process.env.OPENAI_API_KEY || "",
    model: process.env.OPENAI_MODEL || "gpt-4-turbo",
  },

  otp: {
    expiryMinutes: parseInt(process.env.OTP_EXPIRY_MINUTES || "10"),
  },
};
