"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// import { toast } from "@/components/ui/use-toast";
import { useToast } from "@/hooks/use-toast";

export default function CreateEvent() {
  const { toast } = useToast();
  const [eventData, setEventData] = useState({
    name: "",
    date: "",
    location: "",
    price: "",
    supply: "",
    description: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // PENDING ADD INTERACTION WITH BLOCKCHAIN
    console.log("Event data:", eventData);
    toast({
      title: "Event Created",
      description:
        "Your event has been successfully created and the contract has been deployed.",
    });
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Create New Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Event Name</Label>
          <Input
            id="name"
            name="name"
            value={eventData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={eventData.date}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={eventData.location}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="price">Ticket Price (ETH)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            value={eventData.price}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="supply">Ticket Supply</Label>
          <Input
            id="supply"
            name="supply"
            type="number"
            value={eventData.supply}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Event Description</Label>
          <Textarea
            id="description"
            name="description"
            value={eventData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <Button type="submit">Create Event</Button>
      </form>
    </div>
  );
}
