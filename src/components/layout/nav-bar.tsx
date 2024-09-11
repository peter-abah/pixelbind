import Logo from "@/components/icons/logo";

function NavBar() {
  return (
    <header className="px-8 h-14 flex items-center">
      <p className="flex items-center gap-2">
        <Logo width={24} height={24} />
        <span className="font-bold">pixelbind</span>
      </p>
    </header>
  );
}

export default NavBar;
