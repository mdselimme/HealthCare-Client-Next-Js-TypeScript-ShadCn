import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Menu } from "lucide-react";

interface INavLink {
  name: string;
  url: string;
}

const PublicNavbar = () => {
  const navItems: INavLink[] = [
    { name: "Home", url: "/" },
    { name: "Consultation", url: "/consultation" },
    { name: "Health Plans", url: "/health-plan" },
    { name: "Diagnostics", url: "/diagnostics" },
    { name: "NGOs", url: "/ngos" },
  ];

  return (
    <section className="sticky top-0 z-50 bg-background/95 shadow border-b">
      <header className="container mx-auto py-5 px-2 flex justify-between items-center">
        <div>
          <Link className="text-3xl font-bold text-primary" href={"/"}>
            HealthCare
          </Link>
        </div>
        <nav className="hidden md:block">
          <ul className="flex gap-4">
            {navItems.map((item: INavLink) => (
              <li key={item.name}>
                <Link
                  className="text-sm font-medium text-muted-foreground hover:text-primary"
                  href={item.url}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden md:block">
          <Link href={"/login"}>
            <Button>Log In</Button>
          </Link>
        </div>
        {/* Mobile Menu  */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                {" "}
                <Menu />{" "}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-4">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <nav className="flex flex-col space-y-4 mt-8">
                {navItems.map((link) => (
                  <Link
                    key={link.url}
                    href={link.url}
                    className="text-lg font-medium"
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="border-t pt-4 flex flex-col space-y-4">
                  <div className="flex justify-center"></div>
                  <Link href="/login" className="text-lg font-medium">
                    <Button>Login</Button>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </section>
  );
};

export default PublicNavbar;
