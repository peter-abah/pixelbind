import "@/app/globals.css";
import NavBar from "./_components/nav-bar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body className="antialiased flex flex-col min-h-dvh">
      <NavBar />
      {children}
    </body>
  );
}
