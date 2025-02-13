"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function TicketVerification() {
  const { toast } = useToast();
  const [ticketId, setTicketId] = useState("");

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    // PEDING ADD INTERACTION WITH BLOCKCHAIN
    console.log(`Verifying ticket ${ticketId}`);
    toast({
      title: "Ticket Verified",
      description: `Ticket ${ticketId} has been successfully verified.`,
    });
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Verify Ticket</h1>
      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <Label htmlFor="ticketId">Ticket ID</Label>
          <Input
            id="ticketId"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            placeholder="Enter ticket ID"
            required
          />
        </div>
        <Button type="submit">Verify Ticket</Button>
      </form>
    </div>
  );
}
