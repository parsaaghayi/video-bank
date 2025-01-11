import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { Axios_Route } from "@/utils/AxiosRouts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // تنظیم هدرهای CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://video.hooshmandsepehrco.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // مدیریت درخواست‌های OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // مدیریت متدهای غیرمجاز
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // دریافت توکن از کوکی یا هدر
  const token = req.cookies.token || req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "توکن یافت نشد" });
  }

  try {
    const response = await axios.get(
      `${process.env.BASE_URL}${Axios_Route.queuePosition}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token.replace("Bearer ", "")}`,
        },
      }
    );

    // ارسال پاسخ موفق
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Error fetching queue position:", error);

    // بررسی وضعیت خطا
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data || error.message;

    // ارسال پاسخ خطا
    return res.status(statusCode).json({
      message: "خطا در دریافت موقعیت صف",
      error: errorMessage,
    });
  }
}