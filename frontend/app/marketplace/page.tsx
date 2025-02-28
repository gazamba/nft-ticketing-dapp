"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";

import { useEffect, useMemo, useState } from "react";

const MarketplacePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debounceQuery, setDebounceQuery] = useState(searchQuery);

  const resaleTickets = [
    {
      id: 1,
      name: "Web 3 Conference",
      description: "A conference about the future of Web 3.0 technologies.",
      date: "Friday, July 14, 2023",
      location: "Atlantis the Palm, Dubai",
      ticketPrice: 0.037, // ETH price
    },
    {
      id: 2,
      name: "Blockchain Expo",
      description: "The leading blockchain expo in Europe.",
      date: "October, July 14, 2023",
      location: "Olympia, London",
      ticketPrice: 0.037, // ETH price
    },
    {
      id: 3,
      name: "Blockchain Expo 3",
      description: "The leading blockchain expo in Europe.",
      date: "October, July 14, 2023",
      location: "Olympia, London",
      ticketPrice: 0.037, // ETH price
    },
  ];

  useEffect(() => {
    const timeout = setTimeout(() => setDebounceQuery(searchQuery), 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const filteredTickets = useMemo(() => {
    return resaleTickets.filter((ticket) =>
      ticket.name.toLowerCase().includes(debounceQuery.toLowerCase())
    );
  }, [debounceQuery]);

  return (
    <div className="container mx-auto py-10 space-y-6">
      <Heading title="Ticket Marketplace" />
      <p className="text-muted-foreground ">
        Browse and purchase tickets from other users. All transactions are
        secure and verified on the blockchain.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="relative flex items-center w-full max-w-md">
          <Search className="absolute left-3 text-muted-foreground" size={18} />
          <Input
            placeholder="Search events..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div>All Categories list</div>
        <div>Sorting</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTickets.map((item) => (
          <Card key={item.id} className="">
            <CardHeader>
              <Link href={`event/${item.id}`}>
                <CardTitle className="text-2xl">{item.name}</CardTitle>
              </Link>
              <CardDescription>
                <p>{item.date}</p>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="mt-2 text-muted-foreground">{item.location}</p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Current price</p>
                  <p className="font-bold text-3xl">{item.ticketPrice}</p>
                </div>
                <div className="text-muted-foreground">
                  <p>Original price</p>
                  <p className="flex justify-end">{item.ticketPrice}</p>
                </div>
              </div>
              <p className="text-muted-foreground">Seller: 0x131...1234</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button className="w-full">Purchase Ticket Resale</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MarketplacePage;
