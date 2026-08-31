import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: "Contact ReturnGo",
  description: "Get in touch with the ReturnGo team.",
};

const CONTACT_POINTS = [
  { icon: Mail, label: "Email", value: "hello@returngo.in" },
  { icon: Phone, label: "Phone", value: "+91 82345 67890" },
  { icon: MapPin, label: "Office", value: "Mangalore, Karnataka" },
];

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">Contact</span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">Get in touch.</h1>
      <p className="mt-3 max-w-lg text-muted-foreground">
        Questions about Book Taxi, Rent Vehicle, or driving with ReturnGo — reach us directly, or send a message
        below.
      </p>

      <div className="mt-10 grid gap-10 sm:grid-cols-[1fr_1.4fr]">
        <dl className="flex flex-col gap-6">
          {CONTACT_POINTS.map((point) => (
            <div key={point.label} className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                <point.icon className="size-4" />
              </span>
              <div>
                <dt className="font-mono text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {point.label}
                </dt>
                <dd className="mt-0.5 text-sm font-medium text-foreground">{point.value}</dd>
              </div>
            </div>
          ))}
        </dl>

        <form
          action="mailto:hello@returngo.in"
          method="post"
          encType="text/plain"
          className="flex flex-col gap-5 rounded-lg border border-border bg-card p-6 shadow-sm"
        >
          <div>
            <Label htmlFor="contact-name" className="mb-2 block">
              Name
            </Label>
            <Input id="contact-name" name="name" required />
          </div>
          <div>
            <Label htmlFor="contact-email" className="mb-2 block">
              Email
            </Label>
            <Input id="contact-email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="contact-message" className="mb-2 block">
              Message
            </Label>
            <textarea
              id="contact-message"
              name="message"
              rows={4}
              required
              className="flex w-full rounded-md border border-input bg-surface px-3.5 py-2.5 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <Button type="submit" size="lg" className="self-start">
            Send message
          </Button>
        </form>
      </div>
    </section>
  );
}
