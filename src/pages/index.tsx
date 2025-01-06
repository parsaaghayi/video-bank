import { GetServerSideProps } from "next";
import { parse } from "cookie";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    // ۲ ثانیه تأخیر برای بررسی وضعیت ورود
    const checkLoginStatus = setTimeout(() => {
      const cookies = document.cookie; // دریافت کوکی‌ها از مرورگر
      const parsedCookies = parse(cookies);

      // بررسی اینکه آیا کوکی isLogin موجود است و مقدار آن برابر با "true" باشد
      if (!parsedCookies.isLogin || parsedCookies.isLogin !== "true") {
        // اگر کاربر وارد نشده است، هدایت به صفحه logout
        router.push("/logout");
      } else {
        // در غیر این صورت هدایت به صفحه user-queue
        router.push("/user-queue");
      }
    }, 2000); // ۲ ثانیه تأخیر

    return () => clearTimeout(checkLoginStatus); // پاک کردن تایمر در صورت تغییر وضعیت

  }, [router]);

  return (
    <div className="flex flex-col gap-10 justify-center items-center h-screen bg-purple-600">
      <Image
        src={"/images/logo.svg"}
        alt="profile"
        width={150}
        height={150}
        className="cursor-pointer"
      />
      <p className="text-center text-lg font-extrabold text-white">
        ویدئو بانک
      </p>
    </div>
  );
};

export default Home;
