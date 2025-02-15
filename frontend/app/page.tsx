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

const cards = [
  {
    id: 1,
    title: "Web 3 Conference",
    date: "2025-06-10",
    location: "Atlantis the Palm, Dubai",
    description: "A conference about the future of Web 3.0 technologies.",
    content:
      "Join us for a deep dive into the world of decentralized technologies and blockchain.",
  },
  {
    id: 2,
    title: "Blockchain Expo",
    date: "2025-07-15",
    location: "Olympia, London",
    description: "The leading blockchain expo in Europe.",
    content:
      "Explore the latest advancements in blockchain technology and network with industry leaders.",
  },
  {
    id: 3,
    title: "Crypto Summit",
    date: "2025-08-20",
    location: "Marina Bay Sands, Singapore",
    description: "A summit for cryptocurrency enthusiasts and professionals.",
    content:
      "Discuss the future of cryptocurrencies and their impact on the global economy.",
  },
  {
    id: 4,
    title: "NFT Art Fair",
    date: "2025-09-05",
    location: "Javits Center, New York",
    description: "An art fair showcasing the latest in NFT art.",
    content:
      "Discover and purchase unique NFT artworks from artists around the world.",
  },
  {
    id: 5,
    title: "DeFi Conference",
    date: "2025-10-12",
    location: "Palais des Congrès, Paris",
    description: "A conference dedicated to decentralized finance.",
    content: "Learn about the latest trends and innovations in the DeFi space.",
  },
];

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <Heading title="Upcoming Event" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((item) => (
          <Card key={item.id} className="">
            <CardHeader>
              <CardTitle className="text-2xl">{item.title}</CardTitle>
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
