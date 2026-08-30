import { z } from "zod";

export const journeyPlanSchema = z
  .object({
    originId: z.string().min(1, "Select where you're travelling from"),
    destinationId: z.string().min(1, "Select where you're travelling to"),
    date: z.string().min(1, "Select a travel date"),
    time: z.string().min(1, "Select a preferred time"),
    passengers: z.number().int().min(1).max(4),
    journeyType: z.enum(["airport", "hospital", "intercity", "rental"]),
    flexible: z.boolean(),
  })
  .refine((data) => data.originId !== data.destinationId, {
    message: "Origin and destination can't be the same place",
    path: ["destinationId"],
  });

export type JourneyPlanFormValues = z.infer<typeof journeyPlanSchema>;
