import { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        // ارسال درخواست خروج به API
        const response = await axios.post("/api/logout");

        if (response.status === 200) {
          // پس از خروج موفق، کاربر را به صفحه ورود هدایت می‌کنیم
          router.push("/login");
        }
      } catch (error) {
        console.error("Error logging out:", error);
        // در صورت بروز خطا می‌توانید پیام خطا نمایش دهید
      }
    };

    logout();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center text-lg font-semibold">
        در حال خروج از سیستم...
      </div>
    </div>
  );
};

export default Logout;
