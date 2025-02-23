import zod from "zod";

export const eventSchema = zod.object({
  id: zod.number(),
  name: zod.string().min(1, "Name is required").max(255),
  description: zod.string().min(1, "Description is required").max(65535),
  date: zod.date(),
  location: zod.string(),
  ticketPrice: zod.coerce.number(),
  totalTickets: zod.coerce.number(),
});

export const nftSchema = zod.object({
  // TBD
});
