"use client";

import Heading from "@/components/ui/heading";
import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { eventSchema } from "@/validationSchemas";
import axios from "axios";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
  useReadContract,
} from "wagmi";
import toast from "react-hot-toast";
import { SUBGRAPH_URL, EVENT_QUERY } from "@/lib/queries";
import { useMutation, useQuery } from "@tanstack/react-query";
import { parseEventLogs } from "viem";
import EventFactoryArtifact from "@/../backend/artifacts/contracts/EventFactory.sol/EventFactory.json";
import deployedAddresses from "@/../backend/ignition/deployments/chain-11155111/deployed_addresses.json";
import { request } from "graphql-request";
import { ethers } from "ethers";

type EventFormData = z.infer<typeof eventSchema>;

const eventFactoryAddress = deployedAddresses[
  "EventFactoryModule#EventFactory"
] as `0x${string}`;

const CreateEventPage = () => {
  const { isConnected } = useAccount();
  const {
    writeContract,
    data: hash,
    error: writeError,
    isPending: isTxPending,
  } = useWriteContract();
  const { data: receipt, isLoading: isPending } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: nextEventId, isLoading: isNextIdLoading } = useReadContract({
    address: eventFactoryAddress,
    abi: EventFactoryArtifact.abi,
    functionName: "nextEventId",
  });

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: "",
      description: "",
      date: undefined,
      location: "",
      ticketPrice: 0,
      totalTickets: 0,
    },
  });

  const {
    mutate: uploadMetadata,
    isPending: isUploading,
    data: cid,
  } = useMutation({
    mutationFn: async (data: EventFormData) => {
      const response = await axios.post(`/api/event-metadata`, {
        name: data.name,
        description: data.description,
        date: data.date.toISOString(),
        location: data.location,
        ticketPrice: Number(data.ticketPrice),
        totalTickets: Number(data.totalTickets),
      });
      return response.data.cid;
    },
    onSuccess: (cid) => toast.success(`Metadata uploaded to IFPS: ${cid}`),
    onError: (error) => toast.error(`Metadata upload failed: ${error.message}`),
  });

  const { refetch: refetchGraphEvent } = useQuery({
    queryKey: ["eventCreated", receipt?.transactionHash],
    queryFn: async () => {
      if (!receipt) return null;
      const createdEvent = parseEventLogs({
        abi: EventFactoryArtifact.abi,
        eventName: "EventCreated",
        logs: receipt.logs,
      })[0];
      if (!createdEvent) return null;
      const eventId = (createdEvent as any).args.eventId.toString();
      const data = await request(SUBGRAPH_URL, EVENT_QUERY, { eventId });
      return (data as { eventCreateds: any[] }).eventCreateds[0];
    },
    enabled: false,
    staleTime: 60 * 1000,
  });

  const onSubmit = (data: EventFormData) => {
    if (!isConnected) {
      toast.error("Please, connect your wallet to proceed.");
      return;
    }

    if (!nextEventId) {
      toast.error("Failed to fetch next event ID");
      return;
    }

    toast.loading("Uploading metadata...", { id: "metadata" });
    const eventId = Number(nextEventId);
    uploadMetadata({ ...data, eventId });

    useEffect(() => {
      if (cid) {
        toast.dismiss("metadata");
        toast.loading("Creating event on blockchain...", { id: "tx" });
        const data = form.getValues();
        writeContract({
          address: eventFactoryAddress,
          abi: EventFactoryArtifact.abi,
          functionName: "createEvent",
          args: [
            cid,
            "ipfs://event-metada-uri",
            data.totalTickets,
            ethers.parseEther(data.ticketPrice.toString()),
          ],
        });
      }
    }, [cid, writeContract, form]);

    form.reset();
  };

  useEffect(() => {
    if (isTxPending) toast.loading("Transaction pending...", { id: "tx" });
  }, [isTxPending]);

  useEffect(() => {
    if (receipt) {
      toast.dismiss("tx");
      const createdEvent = parseEventLogs({
        abi: EventFactoryArtifact.abi,
        eventName: "EventCreated",
        logs: receipt.logs,
      })[0];

      if (createdEvent) {
        const eventId = (createdEvent as any).args.eventId.toString();
        toast.success(`Event created with ID: ${eventId}`);
        uploadMetadata({ ...form.getValues(), eventId });
        refetchGraphEvent();
      } else {
        toast.error("EventCreated not found in receipt logs");
      }
    }
    if (writeError) {
      toast.dismiss("tx");
      toast.error(`Event creation failed: ${writeError.message}`);
    }
  }, [receipt, writeError, form, uploadMetadata, refetchGraphEvent]);

  return (
    <div className="container mx-auto py-10">
      <Heading title="Create New Event" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter the description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ticketPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ticket Price</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the ticket price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="totalTickets"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Tickets</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the total tickets" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="lg"
            disabled={
              isNextIdLoading || isTxPending || isPending || isUploading
            }
          >
            {isNextIdLoading || isTxPending || isPending || isUploading
              ? "Processing..."
              : "Create Event"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateEventPage;
