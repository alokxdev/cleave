import type { Response } from "express";

export const sendSuccess = <T>(
  res: Response,
  statusCode: number = 200,
  message: string,
  data?: T,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data: data ?? null,
  });
};
