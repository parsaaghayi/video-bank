import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { Axios_Route } from "@/utils/AxiosRouts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // کوکی‌های دریافتی از درخواست برای گرفتن توکن
  const token = req.cookies.token
    ? req.cookies.token
    : req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "توکن یافت نشد" });
  }

  try {
    const response = await axios.get(
      `${process.env.BASE_URL}${Axios_Route.queuePosition}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: req.cookies.token
            ? `Bearer ${req.cookies.token}`
            : req.headers.authorization,
        },
      }
    );
  
    // ارسال پاسخ به فرانت‌اند
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Error fetching queue position:", error);
  
    // بررسی اینکه آیا response وجود دارد
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data || error.message;    
  
    // ارسال پاسخ خطا به فرانت‌اند
    return res.status(statusCode).json({
      message: "خطا در دریافت موقعیت صف",
      error: errorMessage,
    });
  }
  
}
