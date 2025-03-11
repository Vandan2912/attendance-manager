import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#f0f2f5] flex">
      <Sidebar />
      <div className="flex-1 ">
        <Header />
        {children}
      </div>
    </div>
  );
}
