"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { ThemeToggle } from "./theme-toggle";

const NavBar = () => {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const routes = [
    {
      href: "/",
      label: "Home",
    },
    { href: "/create-event", label: "Create Event" }, // restrict to only organizers
    { href: "/my-tickets", label: "My Tickets" },
    { href: "/marketplace", label: "Marketplace" },
  ];

  return (
    <nav className="p-6 h-20 border-b border-b-slate-300 flex items-center">
      <div className="p-4 mr-3 font-bold text-2xl">
        <Link href={`/`}>
          <h2>🎟️ NFT Ticketing dApp</h2>
        </Link>
      </div>
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
      <ThemeToggle />
    </nav>
  );
};

export default NavBar;
