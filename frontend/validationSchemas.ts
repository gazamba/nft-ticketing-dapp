import zod from "zod";

export const eventSchema = zod.object({
  eventId: zod.number().optional(),
  name: zod.string().min(1, "Name is required").max(255),
  description: zod.string().min(1, "Description is required").max(65535),
  category: zod.string().min(1, "Category is required").max(255),
  date: zod.coerce.date(),
  location: zod.string().min(1, "Location is required").max(255),
  ticketPrice: zod.coerce.number().min(1, "Number must be greater than 0"),
  totalTickets: zod.coerce.number().min(1, "Number must be greater than 0"),
});

export const nftSchema = zod.object({
  // TBD
});
