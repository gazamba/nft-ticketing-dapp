import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import React from "react";

interface EventDetailPageProps {
  params: { eventId: string };
}
const EventDetailPage = ({ params }: EventDetailPageProps) => {
  // use params.eventId to fetch real event.

  const event = {
    id: 1,
    name: "Web 3 Conference",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae minima non harum dolores placeat. Vel odio libero fuga nam. Maiores pariatur qui voluptatem eaque, quibusdam accusamus quidem laborum architecto ipsam.",
    date: "Friday, July 14, 2023",
    location: "Atlantis the Palm, Dubai",
    ticketPrice: 0.037, // ETH price
    totalTickets: 100,
  };

  return (
    <div className="container mx-auto py-10">
      <Card key={event.id} className="">
        <CardHeader>
          <CardTitle className="text-2xl">{event.name}</CardTitle>
          <CardDescription>
            {event.date} - {event.location}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{event.description}</p>
          <p className="font-bold">Price: {event.ticketPrice} ETH</p>
          <p>Available Tickets: {event.totalTickets}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button>Purchase Ticket</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EventDetailPage;
