"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const event = {
  id: 1,
  name: "Summer Music Festival",
  date: "2023-07-15",
  location: "Central Park, NY",
  price: 0.1,
  availableTickets: 100,
  description: "Join us for a day of amazing music and fun in the sun!",
};

export default function EventDetails({
  params,
}: {
  params: { eventId: string };
}) {
  const { toast } = useToast();
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handlePurchase = () => {
    setIsPurchasing(true);
    // PENDING ADD INTERACTION WITH BLOCKCHAIN
    setTimeout(() => {
      setIsPurchasing(false);
      toast({
        title: "Ticket Purchased",
        description: "Your NFT ticket has been sent to your wallet.",
      });
    }, 2000);
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>{event.name}</CardTitle>
          <CardDescription>
            {event.date} - {event.location}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{event.description}</p>
          <p className="font-bold">Price: {event.price} ETH</p>
          <p>Available Tickets: {event.availableTickets}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={handlePurchase} disabled={isPurchasing}>
            {isPurchasing ? "Purchasing..." : "Purchase Ticket"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
