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
      <body className={inter.className}>

        <TimeRangeProvider>

          <Sidebar />

          <main className="ml-[200px] px-[15px] py-[15px]">
            <DashboardHeader />
            {children}
          </main>

        </TimeRangeProvider>

      </body>
    </html>
  );
}
