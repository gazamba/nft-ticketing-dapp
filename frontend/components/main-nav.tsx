"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const MainNav = () => {
  const pathname = usePathname();

  const routes = [
    {
      href: "/",
      label: "Home",
      // TODO: highlight when click later..
    },
    { href: "/create-event", label: "Create Event" }, // restrict to non organizers
    { href: "/my-tickets", label: "My Tickets" },
    { href: "/marketplace", label: "Marketplace" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];
  return (
    <div>
      <nav className="p-6 h-20 border-b border-b-slate-300 flex">
        <div className="p-4 flex items-center mr-3 font-bold text-2xl">
          <h2>🎟️ NFT Ticketing dApp</h2>
        </div>
        <div className="flex justify-center text-lg">
          <ul className="flex items-center">
            {routes.map((item) => (
              <li key={item.label} className="ml-6">
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default MainNav;
