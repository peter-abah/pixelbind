import "@/app/globals.css";
import NavBar from "@/components/layout/nav-bar";
import { Toaster } from "@/components/ui/toaster";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body className="antialiased flex flex-col min-h-dvh">
      <NavBar />
      {children}
      <Toaster />
    </body>
  );
}
