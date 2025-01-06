import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { Axios_Route } from "@/utils/AxiosRouts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "متد درخواست صحیح نیست." });
  }

  // چک کردن مقدار Authorization Token
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "توکن یافت نشد" });
  }

  try {
    // ارسال درخواست به API برای حذف کاربر از صف
    const response = await axios.delete(
      `${process.env.BASE_URL}${Axios_Route.removeUserFromQueue}`,
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
      "خطا در حذف کاربر از صف:",
      error.response?.data || error.message
    );

    // مدیریت خطاها
    return res.status(error.response?.status || 500).json({
      message: "خطا در حذف کاربر از صف",
      error: error.response?.data || error.message,
    });
  }
}
