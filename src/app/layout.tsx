import "./globals.css";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import { Inter } from "next/font/google";
import { TimeRangeProvider } from "../hooks/useTimeRange";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300","400","500","600","700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex min-h-screen bg-[#F8FAFC]`}>
        <TimeRangeProvider>
          <Sidebar />
          <main className="flex-1 min-h-screen ml-[240px] flex flex-col">
            <DashboardHeader />
            <div className="flex-1 pt-0">
              {children}
            </div>
          </main>
        </TimeRangeProvider>
      </body>
    </html>
  );
}
