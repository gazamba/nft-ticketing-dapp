"use client";

import Heading from "@/components/ui/heading";
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
import { eventFormSchema } from "@/validationSchemas";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type EventFormData = z.infer<typeof eventFormSchema>;

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

  const { data: nextEventIdRaw, isLoading: isNextIdLoading } = useReadContract({
    address: eventFactoryAddress,
    abi: EventFactoryArtifact.abi,
    functionName: "nextEventId",
  });
  const nextEventId = nextEventIdRaw ? Number(nextEventIdRaw) : undefined;

  const { data: categoriesRaw, isLoading: isLoadingCategories } =
    useReadContract({
      address: eventFactoryAddress,
      abi: EventFactoryArtifact.abi,
      functionName: "getAllCategories",
    });

  const categories = (categoriesRaw as string[]) || [];

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      date: undefined,
      location: "",
      ticketPrice: 0,
      totalTickets: 0,
    },
  });

  const createEventMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      if (!isConnected) throw new Error("Wallet not connected");
      if (!nextEventId) throw new Error("Next event ID not available");

      console.log("Creating group...");
      const groupResponse = await axios.post(`/api/groups`, {
        name: `${data.name} ${nextEventId}`,
      });
      const pinataGroupId = groupResponse.data.group.id;

      console.log("Uploading event metadata...");
      const eventResponse = await axios.post(
        `/api/events/${nextEventId}/metadata`,
        {
          name: data.name,
          description: data.description,
          category: data.category,
          date: data.date.toISOString(),
          location: data.location,
          ticketPrice: Number(data.ticketPrice),
          totalTickets: Number(data.totalTickets),
          pinataGroupId,
        }
      );
      const metadataCID = eventResponse.data.cid;

      console.log("Uploading ticket(s) metadata...");
      const tokenIds = Array.from(
        { length: data.totalTickets },
        (_, i) => i + 1
      );
      const tickets = tokenIds.map((tokenId) => ({
        tokenId,
        name: `${data.name} Event #${nextEventId} Ticket #${tokenId}`,
      }));
      const ticketResponse = await axios.post(
        `/api/events/${nextEventId}/tickets/metadata`,
        {
          tickets,
          pinataGroupId,
        }
      );
      const { ticketCIDs } = ticketResponse.data;

      console.log("Creating event on blockchain...");
      const txHash = await new Promise<string>((resolve, reject) => {
        writeContract(
          {
            address: eventFactoryAddress,
            abi: EventFactoryArtifact.abi,
            functionName: "createEvent",
            args: [
              metadataCID,
              pinataGroupId,
              data.category,
              data.totalTickets,
              ethers.parseEther(data.ticketPrice.toString()),
              tokenIds,
              ticketCIDs,
            ],
          },
          {
            onSuccess: resolve,
            onError: reject,
          }
        );
      });

      return { txHash, eventId: nextEventId, tokenIds, ticketCIDs };
    },
    onMutate: () => toast.loading("Processing event creation...", { id: "tx" }),
    onSuccess: async ({ txHash }) => {
      if (!receipt) return;
      const createdEvent = parseEventLogs({
        abi: EventFactoryArtifact.abi,
        eventName: "EventCreated",
        logs: receipt.logs,
      })[0];
      const eventId = createdEvent
        ? Number((createdEvent as any).args.eventId)
        : null;
      toast.dismiss("tx");
      if (eventId) {
        toast.success(`Event created with ID: ${eventId}`);
        const graphData = await refetchGraphEvent();
        console.log("GraphQL event data:", graphData);
      } else {
        toast.error("EventCreated not found in receipt logs");
      }
      form.reset();
    },
    onError: (error) => {
      toast.dismiss("tx");
      toast.error(`Event creation failed: ${error.message}`);
    },
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
      const eventId = Number((createdEvent as any).args.eventId);
      const data = await request(SUBGRAPH_URL, EVENT_QUERY, {
        eventId: eventId.toString(),
      });
      return (data as { eventCreateds: any[] }).eventCreateds[0];
    },
    enabled: false,
    staleTime: 60 * 1000,
  });

  const onSubmit = (data: EventFormData) => {
    createEventMutation.mutate(data);
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
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  <Input
                    type="number"
                    placeholder="Enter the ticket price"
                    {...field}
                  />
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
                  <Input
                    type="number"
                    placeholder="Enter the total tickets"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="lg"
            disabled={
              isLoadingCategories ||
              isNextIdLoading ||
              isTxPending ||
              isPending ||
              createEventMutation.isPending
            }
          >
            {createEventMutation.isPending ? "Processing..." : "Create Event"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateEventPage;
