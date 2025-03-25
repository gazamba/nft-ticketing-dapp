"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { ThemeToggle } from "./theme-toggle";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NavBar = () => {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const routes = [
    {
      href: "/",
      label: "Home",
    },
    { href: "/create-event", label: "Create Event" },
    { href: "/my-tickets", label: "My Tickets" },
    { href: "/marketplace", label: "Marketplace" },
  ];

  return (
    <nav className="p-6 h-20 border-b border-b-slate-300 flex items-center relative">
      <div className="mr-3 font-bold text-2xl">
        <Link href={`/`}>
          <h2>🎟️ NFT Ticketing dApp</h2>
        </Link>
      </div>

      <button
        className="md:hidden ml-auto"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className="hidden md:flex ml-auto items-center">
        <ul className="flex items-center space-x-4 text-xl">
          {routes.map((item) => (
            <li key={item.label}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
          <li key="connect-wallet">
            {isConnected && address ? (
              <Button
                className="text-xl p-6"
                onClick={() => disconnect()}
                variant="outline"
              >
                Disconnect ({`${address.slice(0, 6)}...${address.slice(-4)}`})
              </Button>
            ) : (
              <Button
                className="text-xl p-6"
                onClick={() => connect({ connector: connectors[0] })}
                variant="outline"
              >
                Connect Wallet
              </Button>
            )}
          </li>
        </ul>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-slate-300 z-50">
          <ul className="flex flex-col p-4 space-y-4 text-xl">
            {routes.map((item) => (
              <li key={item.label}>
                <Link href={item.href} onClick={() => setIsMenuOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li key="connect-wallet">
              {isConnected && address ? (
                <Button
                  className="w-full text-xl p-6"
                  onClick={() => {
                    disconnect();
                    setIsMenuOpen(false);
                  }}
                  variant="outline"
                >
                  Disconnect ({`${address.slice(0, 6)}...${address.slice(-4)}`})
                </Button>
              ) : (
                <Button
                  className="w-full text-xl p-6"
                  onClick={() => {
                    connect({ connector: connectors[0] });
                    setIsMenuOpen(false);
                  }}
                  variant="outline"
                >
                  Connect Wallet
                </Button>
              )}
            </li>
          </ul>
        </div>
      )}

      <div className="hidden md:block ml-4">
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default NavBar;
