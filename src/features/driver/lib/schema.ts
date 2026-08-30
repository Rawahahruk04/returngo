import { z } from "zod";

export const publishJourneySchema = z
  .object({
    driverName: z.string().min(2, "Enter the driver's name"),
    vehicleType: z.enum(["innova", "ertiga", "swift-dzire", "traveller"]),
    vehiclePlate: z
      .string()
      .min(4, "Enter a vehicle registration number")
      .max(15, "That plate number looks too long"),
    originId: z.string().min(1, "Select where the journey starts"),
    destinationId: z.string().min(1, "Select where the journey ends"),
    date: z.string().min(1, "Select a departure date"),
    time: z.string().min(1, "Select a departure time"),
    seatsTotal: z.number().int().min(1, "At least 1 seat is required").max(12, "Maximum 12 seats"),
    purpose: z.enum(["airport", "hospital", "intercity"]),
  })
  .refine((data) => data.originId !== data.destinationId, {
    message: "Origin and destination can't be the same place",
    path: ["destinationId"],
  });

export type PublishJourneyFormValues = z.infer<typeof publishJourneySchema>;
