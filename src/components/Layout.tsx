import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex justify-center" style={{ direction: "rtl" }}>
      <main className="w-[400px] max-w-[100dvw] bg-[#f8f8f8]" style={{ height: "100dvh" }}>
        {children}
      </main>
    </div>
  );
}
