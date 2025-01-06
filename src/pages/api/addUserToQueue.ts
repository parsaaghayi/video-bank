import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { Axios_Route } from "@/utils/AxiosRouts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "مند تعریف نشده است." });
  }

  // چک کردن مقدار Authorization Token
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "توکن یافت نشد" });
  }

  try {
    // درخواست به سرور اصلی
    const response = await axios.post(
      `${process.env.BASE_URL}${Axios_Route.addUserToQueue}`, // استفاده از BASE_URL
      req.body, // داده‌های ارسال شده به API
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`, // ارسال توکن Authorization
        },
      }
    );

    // بازگشت پاسخ موفقیت‌آمیز
    return res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error(
      "خطا در افزودن کاربر به صف:",
      error.response?.data || error.message
    );

    // مدیریت خطاها
    return res.status(error.response?.status || 500).json({
      message: "خطا در افزودن کاربر به صف",
      error: error.response?.data || error.message,
    });
  }
}
