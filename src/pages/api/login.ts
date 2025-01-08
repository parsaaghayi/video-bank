import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { serialize } from "cookie";
import { Axios_Route } from "@/utils/AxiosRouts";

export default async function loginHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (!req.body || !req.body.username || !req.body.role) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  res.setHeader("Access-Control-Allow-Origin", "*"); // یا به جای '*' دامنه مشخص
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  const config = {
    method: "post",
    url: Axios_Route.login,
    baseURL: process.env.BASE_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    data: req.body,
  };

  try {
    const { data: response } = await axios(config);

    // Set cookies for token and login status
    const cookie1 = serialize("token", response.token, {
      httpOnly: false,
      secure: false, // Ensure secure flag is true only in production
      maxAge: 60 * 60 * 24 * 7, // Token expiry in 1 week
      path: "/",
      sameSite: "lax",
    });

    const cookie2 = serialize("username", req.body.username, {
      httpOnly: false,
      secure: false, // Ensure secure flag is true only in production
      maxAge: 60 * 60 * 24 * 7, // Token expiry in 1 week
      path: "/",
      sameSite: "lax",
    });

    const cookie3 = serialize("role", req.body.role, {
      httpOnly: false,
      secure: false, // Ensure secure flag is true only in production
      maxAge: 60 * 60 * 24 * 7, // Token expiry in 1 week
      path: "/",
      sameSite: "lax",
    });

    const cookie4 = serialize("videoToken", "", {
      httpOnly: false,
      secure: false, // برای محیط تولید باید secure=true باشد
      maxAge: -1, // زمان کوکی‌ها را به تاریخ منقضی شده تنظیم می‌کند
      path: "/",
      sameSite: "strict",
    });

    const cookie5 = serialize("roomUrl", "", {
      httpOnly: false,
      secure: false, // برای محیط تولید باید secure=true باشد
      maxAge: -1, // زمان کوکی‌ها را به تاریخ منقضی شده تنظیم می‌کند
      path: "/",
      sameSite: "strict",
    });

    const cookie6 = serialize("isLogin", "true", {
      maxAge: 60 * 60 * 24 * 7, // Login status expiry in 1 week
      path: "/",
    });

    // Set cookies in the response header
    res.setHeader("Set-Cookie", [
      cookie1,
      cookie2,
      cookie3,
      cookie4,
      cookie5,
      cookie6,
    ]);
    res.status(200).json({ success: true, role: req.body.role });
  } catch (error: any) {
    console.log("error:", error);

    let response = error.response?.data || { message: "An error occurred" };
    res.status(error.response?.status || 500).json({ response });
  }
}
