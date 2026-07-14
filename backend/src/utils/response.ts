import { Response } from "express";
import { ApiResponse } from "@/types";

export const sendSuccess = <T>(res: Response, data: T, message?: string, statusCode: number = 200): void => {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };
  if (message) response.message = message;
  res.status(statusCode).json(response);
};

export const sendError = (res: Response, message: string, statusCode: number = 400, errors?: Record<string, string[]>): void => {
  const response: ApiResponse = {
    success: false,
    message,
  };
  if (errors) response.errors = errors;
  res.status(statusCode).json(response);
};

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
  message?: string
): void => {
  const response: ApiResponse<T[]> = {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
  if (message) response.message = message;
  res.status(200).json(response);
};
