"use client";
import React, { useState } from "react";
import { CoinsIcon, HomeIcon, Layers2Icon, MenuIcon, ShieldCheckIcon } from "lucide-react";
import Logo from './Logo';
import Link from 'next/link'; // Import the Link component from Next.js
import { Button, buttonVariants } from "./ui/button";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import UserAvailableCreditsBadge from "./UserAvailableCreditsBadge";

const routes = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/workflows", label: "Workflows", icon: Layers2Icon },
  { href: "/credentials", label: "Credentials", icon: ShieldCheckIcon },
  { href: "/billing", label: "Billing", icon: CoinsIcon },
];

function DesktopSidebar() {
    const pathname = usePathname();

    const activeRoute = routes.find(route => 
        route.href === "/" 
            ? pathname === route.href // Exact match for root
            : pathname.includes(route.href) // Check for inclusion for other paths
    ) || routes[0];

    return (
    <div className="hidden relative md:block min-w-[280px] max-w-[280px] h-screen overflow-hidden w-full bg-primary/5 dark:bg-secondary/30 dark:text-foreground text-muted-foreground border-r-2 border-separate">
      <div className="flex items-center justify-center gap-2 border-b-[1px] border-separater p-4">
        <Logo />
      </div>
      <div className="p-2"><UserAvailableCreditsBadge/></div>

      <div className="flex flex-col p-2">
        {routes.map((route) => (
            <Link key={route.href} href={route.href} className={buttonVariants({variant:activeRoute.href===route.href?"sidebarActiveItem":"sidebarItem"})}>
              <route.icon size={20} />
              <span>{route.label}</span>
            </Link>
        ))}
      </div>
    </div>
  );
}

export function MobileSidebar(){
  const [isOpen, setOpen] = useState(false);
  const pathname = usePathname();

  const activeRoute = routes.find(route => 
      route.href === "/" 
          ? pathname === route.href // Exact match for root
          : pathname.includes(route.href) // Check for inclusion for other paths
  ) || routes[0];

  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex item-center justify-between px-8">
        <Sheet open={isOpen} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400] sm:w-[540] space-y-4" side={"left"}>
            <Logo />
            <UserAvailableCreditsBadge/>
            <div className="flex flex-col gap-1">
              {routes.map((route) => (
                <Link key={route.href} href={route.href} className={buttonVariants({variant:activeRoute.href===route.href?"sidebarActiveItem":"sidebarItem"})} onClick={() => setOpen((prev) => !prev)}>
                  <route.icon size={20} />
                  <span>{route.label}</span>
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}

export default DesktopSidebar;
