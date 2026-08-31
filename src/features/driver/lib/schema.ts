import { z } from "zod";

export const publishJourneySchema = z
  .object({
    originId: z.string().min(1, "Select where the journey starts"),
    destinationId: z.string().min(1, "Select where the journey ends"),
    date: z.string().min(1, "Select a departure date"),
    time: z.string().min(1, "Select a departure time"),
    seatsTotal: z.number().int().min(1, "At least 1 seat is required").max(12, "Maximum 12 seats"),
    purpose: z.enum(["airport", "hospital", "intercity"]),
    price: z.number().int().min(1, "Enter the price for this journey"),
    notes: z.string().max(280, "Keep notes under 280 characters").optional(),
  })
  .refine((data) => data.originId !== data.destinationId, {
    message: "Origin and destination can't be the same place",
    path: ["destinationId"],
  });

export type PublishJourneyFormValues = z.infer<typeof publishJourneySchema>;
