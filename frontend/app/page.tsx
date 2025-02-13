import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const events = [
  {
    id: 1,
    name: "Summer Music Festival",
    date: "2023-07-15",
    location: "Central Park, NY",
  },
  {
    id: 2,
    name: "Tech Conference 2023",
    date: "2023-08-22",
    location: "Convention Center, SF",
  },
  {
    id: 3,
    name: "Art Exhibition",
    date: "2023-09-10",
    location: "Modern Art Museum, LA",
  },
];

export default function EventList() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <CardTitle>{event.name}</CardTitle>
              <CardDescription>{event.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{event.location}</p>
            </CardContent>
            <CardFooter>
              <Link href={`/event/${event.id}`}>
                <Button>View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
