import { z } from "zod";

export const passengerDetailsSchema = z.object({
  name: z.string().trim().min(2, "Enter the passenger's full name"),
  phone: z
    .string()
    .trim()
    .regex(/^(\+91[\s-]?)?[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
});

export type PassengerDetailsValues = z.infer<typeof passengerDetailsSchema>;
