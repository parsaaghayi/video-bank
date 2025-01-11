import { GetServerSideProps } from "next"; // For server-side data fetching
import Image from "next/image"; // For optimized image rendering
import { redirect, useRouter } from "next/navigation"; // For navigation and redirects
import React, { useEffect, useState } from "react"; // React core and hooks
import { parseCookies } from "nookies"; // Utility to handle cookies on both client and server
import { notify, ToastType } from "@/utils/toast"; // Notification utility
import axios from "axios"; // HTTP client for API requests

// Component to manage user queue functionality
const UserQueue = ({
  initialPosition,
  initialLength,
  initialVideoToken,
  initialRoomUrl,
}: {
  initialPosition: number | null;
  initialLength: number | null;
  initialVideoToken: string | null;
  initialRoomUrl: string | null;
}) => {
  // State management
  const [userRole, setUserRole] = useState(""); // User's role (e.g., user or operator)
  const [addToQueueloading, setAddToQueueloading] = useState(false); // Loading state for adding to queue
  const [nextUserLoading, setNextUserLoading] = useState(false); // Loading state for fetching the next user
  const [removeFromQueueloading, setRemoveFromQueueloading] = useState(false); // Loading state for removing from queue
  const [queuePosition, setQueuePosition] = useState<number | null>(
    initialPosition
  ); // Current position in queue
  const [queueLength, setQueueLength] = useState<number | null>(initialLength); // Total length of the queue
  const [videoToken, setVideoToken] = useState<string | null>(
    initialVideoToken
  ); // Token for video conference
  const [roomUrl, setRoomUrl] = useState<string | null>(initialRoomUrl); // URL for the video conference room
  const [step, setStep] = useState(initialPosition !== null ? 2 : 1); // Step in the queue process
  const router = useRouter(); // Next.js router for navigation

  // Effect: Retrieve user role from cookies
  useEffect(() => {
    const getCookie = (name: string): string | null => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      return parts.length === 2
        ? parts.pop()?.split(";").shift() || null
        : null;
    };

    const userRoleCookie = getCookie("role");
    if (userRoleCookie) {
      setUserRole(userRoleCookie);
    }
  }, []);

  // Effect: Periodically fetch queue position based on role
  useEffect(() => {
    const interval = setInterval(() => {
      getPosition();
    }, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [step, userRole]);

  // Effect: Update step and set cookies when videoToken changes
  useEffect(() => {
    if (videoToken !== null) {
      setStep(3);

      // Set cookies for videoToken and roomUrl
      document.cookie = `videoToken=${videoToken}; Path=/; Secure; SameSite=Strict; Expires=${new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toUTCString()}`;

      document.cookie = `roomUrl=${roomUrl}; Path=/; Secure; SameSite=Strict; Expires=${new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toUTCString()}`;
    }
  }, [videoToken]);

  // Function: Fetch queue position and details from API
  const getPosition = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/getQueuePosition`,
        { withCredentials: true } // Include cookies in request
      );

      if (response.status === 200) {
        const data = response.data;
        setQueuePosition(data.position || null);
        setQueueLength(data.queueLength || null);
        setVideoToken(data.userToken || null);
        setRoomUrl(data.roomUrl || null);
      }
    } catch (error: any) {
      if (error.response) {
        setQueueLength(error.response.data.error.queueLength || null);
      }
    }
  };

  // Function: Add user to the queue
  const handleAddUserToQueue = async () => {
    setAddToQueueloading(true);
    try {
      const response = await fetch("/api/addUserToQueue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.status === 401 || response.status === 403) {
        notify(
          "برای استفاده از این قابلیت باید وارد حساب کاربری شوید.",
          ToastType.error
        );
        router.push("/logout");
        return;
      }

      const data = await response.json();
      getPosition();
      notify("کاربر با موفقیت به صف اضافه شد.", ToastType.success);
      setStep(2);
    } catch (error: any) {
      console.error("Error adding user to queue:", error);
      notify("خطایی در اضافه کردن کاربر به صف رخ داد.", ToastType.error);
    } finally {
      setAddToQueueloading(false);
    }
  };

  // Function: Remove user from the queue
  const handleRemoveUserFromQueue = async () => {
    setRemoveFromQueueloading(true);
    try {
      const response = await fetch("/api/removeUserFromQueue", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.status === 401) {
        notify(
          "برای استفاده از این قابلیت باید وارد حساب کاربری شوید.",
          ToastType.error
        );
        router.push("/logout");
        return;
      }

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      notify("کاربر با موفقیت از صف حذف شد.", ToastType.success);
      setStep(1);
      setQueuePosition(null);
      setQueueLength(null);
      setVideoToken(null);
      setRoomUrl(null);
    } catch (error: any) {
      console.error("Error removing user from queue:", error);
      notify("خطایی در حذف کاربر از صف رخ داد.", ToastType.error);
    } finally {
      setRemoveFromQueueloading(false);
    }
  };

  // Function: Redirect to video conference
  const handleCallConference = async () => {
    router.push("video-bank");
  };

  // Function: Fetch details for the next user in the queue
  const handleNextUser = async () => {
    setNextUserLoading(true);
    try {
      const response = await fetch("/api/getNextQueue", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setVideoToken(data.operatorToken || null);
      setRoomUrl(data.roomUrl || null);

      // Set cookies if videoToken exists
      if (videoToken !== null) {
        document.cookie = `videoToken=${videoToken}; Path=/; Secure; SameSite=Strict; Expires=${new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toUTCString()}`;

        document.cookie = `roomUrl=${roomUrl}; Path=/; Secure; SameSite=Strict; Expires=${new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toUTCString()}`;
      }

      router.push("video-bank");
    } catch (error) {
      console.error("Error fetching queue position:", error);
    } finally {
      setNextUserLoading(false);
    }
  };

  return (
    <div className="w-full  h-[100dvh] flex flex-col justify-between">
      <div className="topbar flex justify-between items-center m-2">
        <div className="p-2 w-[40px] h-[40px] rounded-2xl bg-white">
          <Image
            src={"/images/profile.svg"}
            alt="profile"
            width={40}
            height={40}
            className="cursor-pointer"
            onClick={() => {
              window.location.href = "/logout";
            }}
          />
        </div>
        <h1 className="text-xl font-bold">نوبت دهی تصویری</h1>
        <Image
          src={"/images/notification.svg"}
          alt="notification"
          width={40}
          height={40}
          className="cursor-pointer"
        />
      </div>
      <div className="h-full pt-5 pb-2 flex flex-col items-center gap-5 px-5">
        <Image
          src={"/images/bg-img.svg"}
          alt="bg-img"
          width={250}
          height={100}
        />
        <Image src={"/images/tik.svg"} alt="tik" width={50} height={50} />
        {userRole == "user" ? (
          <div className="flex flex-col justify-between items-center w-full h-full">
            {queuePosition !== null ? (
              <p className="text-justify">
                شما نفر{" "}
                <span className="text-purple-600">{queuePosition} </span>
                از {queueLength} در صف انتظار هستید...
              </p>
            ) : step !== 3 ? (
              <p className="text-justify">
                با زدن بر روی دکمه‌ی پایین می‌توانید وارد صف انتظار شوید.
              </p>
            ) : null}
            {step === 1 ? (
              <p className="text-lg text-justify">
                کاربر گرامی برای ارتباط ویدیویی با اپراتور لطفا بر روی درخواست
                کلیک کرده و منتظر نوبت خود باشید.
              </p>
            ) : step === 2 ? (
              <p className="text-lg text-justify">
                لطفا تا فرا رسیدن نوبت صبور باشید...
              </p>
            ) : step === 3 ? (
              <p className="text-center">
                اپراتور منتظر ارتباط با شما است؛
                <br></br>
                روی دکمه‌ی{" "}
                <span className="text-purple-600 font-bold">
                  ارتباط با اپراتور
                </span>{" "}
                کلیک کنید.
              </p>
            ) : null}

            {step === 1 ? (
              <button
                className={`w-full h-[50px] ${
                  addToQueueloading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-600"
                } text-white rounded-xl`}
                type="button"
                disabled={addToQueueloading}
                onClick={handleAddUserToQueue}
              >
                {addToQueueloading ? "در حال پردازش..." : "درخواست نوبت"}
              </button>
            ) : step === 2 ? (
              <button
                className={`w-full h-[50px] ${
                  addToQueueloading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-white border-purple-600 border-2"
                } text-purple-600 font-bold rounded-xl`}
                type="button"
                disabled={removeFromQueueloading}
                onClick={handleRemoveUserFromQueue}
              >
                {removeFromQueueloading
                  ? "در حال پردازش..."
                  : "لغو درخواست نوبت"}
              </button>
            ) : step === 3 ? (
              <button
                className={`w-full h-[50px] ${
                  addToQueueloading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-600"
                } text-white rounded-xl`}
                type="button"
                onClick={handleCallConference}
              >
                ارتباط با اپراتور
              </button>
            ) : null}
          </div>
        ) : userRole === "operator" ? (
          <div className="flex flex-col justify-between items-center w-full h-full">
            {queueLength !== null ? (
              <p className="text-justify">
                <span className="text-purple-600">{queueLength} نفر </span>
                در صف انتظار هستند...
              </p>
            ) : (
              <p className="text-justify">صف انتظار خالی است.</p>
            )}

            <button
              className={`w-full h-[50px] ${
                nextUserLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600"
              } text-white rounded-xl`}
              type="button"
              onClick={handleNextUser}
              disabled={queueLength === 0}
            >
              ارتباط با کاربر بعدی
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const cookies = parseCookies({ req });
  let Token = cookies.token;

  // بررسی اینکه آیا کوکی isLogin موجود است و مقدار آن برابر با "true" باشد
  if (!cookies.isLogin || cookies.isLogin !== "true") {
    // اگر کوکی isLogin وجود ندارد یا مقدار آن false باشد، کاربر به صفحه logout هدایت می‌شود
    return {
      redirect: {
        destination: "/logout", // هدایت به صفحه logout
        permanent: false, // هدایت موقت
      },
    };
  }

  // گرفتن موقعیت صف از API
  let initialPosition: number | null = null;
  let initialLength: number | null = null;
  let initialVideoToken: string | null = null;
  let initialRoomUrl: string | null = null;
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/getQueuePosition`,
    {
      headers: {
        Authorization: `Bearer ${Token}`,
      },
      withCredentials: true, // برای ارسال کوکی‌ها
    }
  );

  if (response.status === 200) {
    const data = response.data;
    console.log(data);

    initialPosition = data.position
      ? data.position !== null
        ? data.position
        : 1
      : null; // اگر position null باشد مقدار 1 می‌شود
    initialLength = data.queueLength
      ? data.queueLength !== null
        ? data.queueLength
        : 1
      : null; // اگر queueLength null باشد مقدار 1 می‌شود
    initialVideoToken = data.userToken
      ? data.userToken !== null
        ? data.userToken
        : null
      : null; // اگر position null باشد مقدار 1 می‌شود
    initialRoomUrl = data.roomUrl
      ? data.roomUrl !== null
        ? data.roomUrl
        : null
      : null; // اگر position null باشد مقدار 1 می‌شود
  }

  return {
    props: {
      initialPosition, // ارسال مقدار position به کامپوننت
      initialLength,
      initialVideoToken,
      initialRoomUrl,
    },
  };
};

export default UserQueue;
