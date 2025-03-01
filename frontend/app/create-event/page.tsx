"use client";

import Heading from "@/components/ui/heading";
import React from "react";
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
import { usePathname } from "next/navigation";
import axios from "axios";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import toast from "react-hot-toast";
import { SUBGRAPH_URL, EVENT_QUERY } from "@/lib/queries";
import { useMutation, useQuery } from "@tanstack/react-query";
import { parseEventLogs } from "viem";
import EventFactoryABI from "@/../backend/artifacts/contracts/EventFactory.sol/EventFactory.json";
import { request } from "graphql-request";

type EventFormData = z.infer<typeof eventSchema>;

const CreateEventPage = () => {
  const { isConnected } = useAccount();
  const currentPath = usePathname();
  const { writeContract, data: hash, error: writeError } = useWriteContract();
  const { data: receipt, isLoading: isPending } = useWaitForTransactionReceipt({
    hash,
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

  const { mutate: uploadData, isPending: isUploading } = useMutation({
    mutationFn: async (data: EventFormData & { eventId: string }) => {
      const response = await axios.post(`${currentPath}/api/event-metadata`, {
        eventId: data.eventId,
        name: data.name,
        description: data.description,
        date: data.date?.toISOString(),
        location: data.location,
        ticketPrice: data.ticketPrice,
        totalTickets: data.totalTickets,
      });
      return response.data.cid;
    },
    onSuccess: (cid) => toast.success(`Metadata uploaded to IFPS: ${cid}`),
    onError: (error) => toast.error(`Metadata upload failed: ${error.message}`),
  });

  const { data: graphEvent, refetch: refetchGraphEvent } = useQuery({
    queryKey: ["eventCreated", receipt?.transactionHash], // CHECK IF eventCreated should be EventCreated
    queryFn: async () => {
      if (!receipt) return null;
      const events = parseEventLogs({
        abi: EventFactoryABI.abi,
        logs: receipt.logs,
      });

      const createdEvent = events.find((e) => e.eventName === "EventCreated");
      if (!createdEvent) return null;
      const eventId = createdEvent.args.eventId.toString();
      const data = await request(SUBGRAPH_URL, EVENT_QUERY, { eventId });
      return data.eventCreated[0];
    },
    enabled: !!receipt,
    staleTime: 60 * 1000,
  });

  const onSubmit = (data: EventFormData) => {
    if (!isConnected) {
      toast.error("Please, connect your wallet to proceed.");
    } else {
      // first create event smart contract to get the eventId

      try {
      } catch (error) {}

      //second, call api to create event metadata json to IPFS
      // bind json form data with event Id to POST

      try {
        axios.post(`${currentPath}/event-metadata`);
      } catch (error) {}
      // add toast messages
      console.log("Form data: ", data);
      // console.log("Event Id: ", data.id);
      // console.log("Event Date: ", data.date);
      form.reset();
    }
  };

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
          <Button type="submit" size="lg">
            Create Event
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateEventPage;
