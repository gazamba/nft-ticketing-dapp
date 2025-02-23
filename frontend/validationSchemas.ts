import zod from "zod";

export const eventSchema = zod.object({
  id: zod.number().optional(),
  name: zod.string().min(1, "Name is required").max(255),
  description: zod.string().min(1, "Description is required").max(65535),
  date: zod.date(),
  location: zod.string().min(1, "Location is required").max(255),
  ticketPrice: zod.coerce.number().min(1, "Number must be greater than 0"),
  totalTickets: zod.coerce.number().min(1, "Number must be greater than 0"),
});

export const nftSchema = zod.object({
  // TBD
});
