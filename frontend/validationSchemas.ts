import * as z from "zod";

export const eventFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().min(1, "Description is required").max(65535),
  category: z.string().min(1, "Category is required").max(255),
  date: z.coerce.date(),
  location: z.string().min(1, "Location is required").max(255),
  ticketPrice: z.coerce.number().min(1, "Number must be greater than 0"),
  totalTickets: z.coerce.number().min(1, "Number must be greater than 0"),
});

export const eventSchema = eventFormSchema.extend({
  eventId: z.number().optional(),
  pinataGroupId: z.string().optional(),
  metadataCID: z.string().optional(),
});

export const ticketNFTSchema = z.object({
  tickets: z.array(
    z.object({
      tokenId: z.number().min(1, "Token ID must be greater than 0"),
      name: z.string().min(1, "Name is required").max(255).optional(),
    })
  ),
  pinataGroupId: z.string().optional(),
});
