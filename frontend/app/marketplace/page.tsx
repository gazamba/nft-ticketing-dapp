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
import { toast, useToast } from "@/hooks/use-toast";

const resaleTickets = [
  {
    id: 1,
    eventName: "Summer Music Festival",
    date: "2023-07-15",
    price: 0.15,
  },
  { id: 2, eventName: "Tech Conference 2023", date: "2023-08-22", price: 0.2 },
];

export default function TicketResale() {
  const { toast } = useToast();
  const handlePurchase = (ticketId: number, price: number) => {
    // PENDING ADD INTERACTION WITH BLOCKCHAIN
    console.log(`Purchasing ticket ${ticketId} for ${price} ETH`);
    toast({
      title: "Ticket Purchased",
      description: `You have successfully purchased the ticket for ${price} ETH.`,
    });
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Ticket Marketplace</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resaleTickets.map((ticket) => (
          <Card key={ticket.id}>
            <CardHeader>
              <CardTitle>{ticket.eventName}</CardTitle>
              <CardDescription>{ticket.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Price: {ticket.price} ETH</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handlePurchase(ticket.id, ticket.price)}>
                Purchase
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
