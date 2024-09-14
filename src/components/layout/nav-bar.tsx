import Logo from "@/components/icons/logo";

function NavBar() {
  return (
    <header className="px-8 h-14 flex items-center shrink-0 z-50 border-b">
      <p className="flex items-center gap-2">
        <Logo width={24} height={24} />
        <span className="font-bold">pixelbind</span>
      </p>
    </header>
  );
}

export default NavBar;
