import Layout from "@/components/Layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import localFont from "next/font/local";
import { NextPage } from "next";
// تعریف نوع برای ویژگی useLayout
type NextPageWithLayout = NextPage & {
  useLayout?: boolean;
};

const Vazirmatn = localFont({
  src: "../fonts/Vazirmatn[wght].ttf",
  display: "swap",
});

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
export default function App({ Component, pageProps }: AppPropsWithLayout) {
  // بررسی می‌کنیم که آیا صفحه نیاز به Layout دارد یا نه
  const useLayout = Component.useLayout || true;

  if (useLayout) {
    return (
      <Layout>
        <div className={`${Vazirmatn.className}`}>
          <Component {...pageProps} />
        </div>
      </Layout>
    );
  }

  return (
    <div className={`${Vazirmatn.className}`}>
      <Component {...pageProps} />
    </div>
  );
}
