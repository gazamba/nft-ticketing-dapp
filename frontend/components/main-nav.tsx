"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

const MainNav = () => {
  const pathname = usePathname();
  const [isLoggedUser, setIsLoggedUser] = useState(false);

  const routes = [
    {
      href: "/",
      label: "Home",
      // TODO: highlight when click later..
    },
    { href: "/create-event", label: "Create Event" }, // restrict to only organizers
    { href: "/my-tickets", label: "My Tickets" },
    { href: "/marketplace", label: "Marketplace" },
  ];

  return (
    <nav className="p-6 h-20 border-b border-b-slate-300 flex items-center">
      <div className="p-4 mr-3 font-bold text-2xl">
        <h2>🎟️ NFT Ticketing dApp</h2>
      </div>
      <ul className="flex items-center space-x-4 text-xl">
        {routes.map((item) => (
          <li key={item.label}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
        {!isLoggedUser && (
          <li key="connect-wallet">
            <Button className="text-xl p-6" variant="outline">
              Connect Wallet
            </Button>
          </li>
        )}
      </ul>
      <div className="p-4 ml-auto">
        <Sun />
        Toogle theme
        <Moon />
      </div>
    </nav>
  );
};

export default MainNav;
