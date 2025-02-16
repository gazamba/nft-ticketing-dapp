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

const events = [
  {
    id: 1,
    name: "Web 3 Conference",
    description: "A conference about the future of Web 3.0 technologies.",
    date: "2025-06-10",
    location: "Atlantis the Palm, Dubai",
    ticketPrice: 0.037, // ETH price
  },
  {
    id: 2,
    name: "Blockchain Expo",
    description: "The leading blockchain expo in Europe.",
    date: "2025-07-15",
    location: "Olympia, London",
    ticketPrice: 0.037, // ETH price
  },
  {
    id: 3,
    name: "Crypto Summit",
    description: "A summit for cryptocurrency enthusiasts and professionals.",
    date: "2025-08-20",
    location: "Marina Bay Sands, Singapore",
    ticketPrice: 0.037, // ETH price
  },
  {
    id: 4,
    name: "NFT Art Fair",
    description: "An art fair showcasing the latest in NFT art.",
    date: "2025-09-05",
    location: "Javits Center, New York",
    ticketPrice: 0.03, // ETH price
  },
  {
    id: 5,
    name: "DeFi Conference",
    description: "A conference dedicated to decentralized finance.",
    date: "2025-10-12",
    location: "Palais des Congrès, Paris",
    ticketPrice: 0.03, // ETH price
  },
];

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <Heading title="Upcoming Event" />
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
              <Button>View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
