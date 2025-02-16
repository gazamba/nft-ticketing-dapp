"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Heading from "@/components/ui/heading";
import { useRouter } from "next/navigation";

export default function Home() {
  const events = [
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
    {
      id: 3,
      name: "Crypto Summit",
      description: "A summit for cryptocurrency enthusiasts and professionals.",
      date: "Wednesday, August 20, 2025",
      location: "Marina Bay Sands, Singapore",
      ticketPrice: 0.037, // ETH price
    },
    {
      id: 4,
      name: "NFT Art Fair",
      description: "An art fair showcasing the latest in NFT art.",
      date: "Friday, September 5, 2025",
      location: "Javits Center, New York",
      ticketPrice: 0.03, // ETH price
    },
    {
      id: 5,
      name: "DeFi Conference",
      description: "A conference dedicated to decentralized finance.",
      date: "Sunday, October 12, 2025",
      location: "Palais des Congrès, Paris",
      ticketPrice: 0.03, // ETH price
    },
  ];
  const router = useRouter();
  return (
    <div className="container mx-auto py-10">
      <Heading title="Upcoming Events" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((item) => (
          <Card key={item.id} className="">
            <CardHeader>
              <CardTitle className="text-2xl">{item.name}</CardTitle>
              <CardDescription>{item.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{item.location}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => router.push(`/event/${item.id}`)}>
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
