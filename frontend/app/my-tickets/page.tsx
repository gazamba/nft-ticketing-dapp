"use client";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

// get tickets minted to user's logged wallet
// show up tickets with card component
// view card details for further info
// list ticket for resale

const MyTicketsPage = () => {
  const myTickets = [
    {
      id: 1,
      name: "Web 3 Conference",
      description: "A conference about the future of Web 3.0 technologies.",
      date: "Friday, June 10, 2025",
      location: "Atlantis the Palm, Dubai",
      ticketPrice: 0.037, // ETH price
    },
    {
      id: 2,
      name: "Blockchain Expo",
      description: "The leading blockchain expo in Europe.",
      date: "Tuesday, July 15, 2025",
      location: "Olympia, London",
      ticketPrice: 0.037, // ETH price
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <Heading title="My Tickets" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myTickets.map((item) => (
          <Card key={item.id} className="">
            <CardHeader>
              <Link href={`event/${item.id}`}>
                <CardTitle className="text-2xl">{item.name}</CardTitle>
              </Link>
              <CardDescription>{item.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{item.location}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button>List for Resale</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyTicketsPage;
