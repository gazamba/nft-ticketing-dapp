import Link from "next/link";
import { Button } from "@/components/ui/button";

export function MainNav() {
  return (
    <div className="flex items-center space-x-4 lg:space-x-6">
      <Link
        href="/"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Home
      </Link>
      <Link
        href="/create-event"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Create Event
      </Link>
      <Link
        href="/my-tickets"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        My Tickets
      </Link>
      <Link
        href="/marketplace"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Marketplace
      </Link>
      <Button variant="outline">Connect Wallet</Button>
    </div>
  );
}
