import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex justify-center w-full h-[100vh]" style={{direction:"rtl"}}>
      <main className=" w-[360px] max-w-[100vw] bg-[#f8f8f8] h-full">{children}</main>
    </div>
  );
}
