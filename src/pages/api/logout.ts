import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default async function logoutHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // حذف کوکی‌ها برای خروج کاربر
    const cookie1 = serialize("token", "", {
      httpOnly: true,
      secure: false, // برای محیط تولید باید secure=true باشد
      maxAge: -1, // زمان کوکی‌ها را به تاریخ منقضی شده تنظیم می‌کند
      path: "/",
      sameSite: "strict",
    });

    const cookie2 = serialize("username", "", {
      httpOnly: true,
      secure: false, // برای محیط تولید باید secure=true باشد
      maxAge: -1, // زمان کوکی‌ها را به تاریخ منقضی شده تنظیم می‌کند
      path: "/",
      sameSite: "strict",
    });

    const cookie3 = serialize("role", "", {
      httpOnly: true,
      secure: false, // برای محیط تولید باید secure=true باشد
      maxAge: -1, // زمان کوکی‌ها را به تاریخ منقضی شده تنظیم می‌کند
      path: "/",
      sameSite: "strict",
    });

    const cookie4 = serialize("videoToken", "", {
      httpOnly: true,
      secure: false, // برای محیط تولید باید secure=true باشد
      maxAge: -1, // زمان کوکی‌ها را به تاریخ منقضی شده تنظیم می‌کند
      path: "/",
      sameSite: "strict",
    });

    const cookie5 = serialize("roomUrl", "", {
      httpOnly: true,
      secure: false, // برای محیط تولید باید secure=true باشد
      maxAge: -1, // زمان کوکی‌ها را به تاریخ منقضی شده تنظیم می‌کند
      path: "/",
      sameSite: "strict",
    });

    const cookie6 = serialize("isLogin", "false", {
      maxAge: -1, // زمان کوکی‌ها را به تاریخ منقضی شده تنظیم می‌کند
      path: "/",
    });

    // تنظیم کوکی‌ها در پاسخ
    res.setHeader("Set-Cookie", [
      cookie1,
      cookie2,
      cookie3,
      cookie4,
      cookie5,
      cookie6,
    ]);

    // ارسال موفقیت عملیات خروج
    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error during logout:", error);
    res.status(500).json({ success: false, message: "خطا در هنگام خروج" });
  }
}
