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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const userTickets = [
  { id: 1, eventName: "Summer Music Festival", date: "2023-07-15" },
  { id: 2, eventName: "Tech Conference 2023", date: "2023-08-22" },
];

export default function UserTickets() {
  const { toast } = useToast();
  const [resalePrice, setResalePrice] = useState("");

  const handleResale = (ticketId: number) => {
    //pending add interaction with blockchain
    console.log(`Listing ticket ${ticketId} for resale at ${resalePrice} ETH`);
    toast({
      title: "Ticket Listed",
      description: `Your ticket has been listed for resale at ${resalePrice} ETH.`,
    });
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">My Tickets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userTickets.map((ticket) => (
          <Card key={ticket.id}>
            <CardHeader>
              <CardTitle>{ticket.eventName}</CardTitle>
              <CardDescription>{ticket.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Ticket ID: {ticket.id}</p>
            </CardContent>
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>List for Resale</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>List Ticket for Resale</DialogTitle>
                    <DialogDescription>
                      Enter the price at which you want to list your ticket for
                      resale.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="price" className="text-right">
                        Price (ETH)
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={resalePrice}
                        onChange={(e) => setResalePrice(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => handleResale(ticket.id)}>
                      List for Resale
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
