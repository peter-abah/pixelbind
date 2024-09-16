import Logo from "@/components/icons/logo";
import Link from "next/link";

function NavBar() {
  return (
    <header className="px-8 h-14 flex items-center shrink-0 z-50">
      <Link href="/" className="flex items-center gap-2">
        <Logo width={24} height={24} />
        <span className="font-bold">pixelbind</span>
      </Link>
    </header>
  );
}

export default NavBar;
