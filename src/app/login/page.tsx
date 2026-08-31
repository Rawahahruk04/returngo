"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAccount } from "@/features/auth/data/account-store";
import { ROLE_DASHBOARD_PATH, ROLE_LABEL } from "@/features/auth/lib/roles";

export default function LoginPage() {
  const router = useRouter();
  const { account, hydrated } = useAccount();

  if (hydrated && !account) {
    return (
      <section className="mx-auto max-w-md px-4 py-14 text-center sm:px-6 sm:py-24 lg:px-8">
        <span className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">Sign in</span>
        <h1 className="mt-3 font-display text-3xl font-semibold text-foreground">No account on this device</h1>
        <p className="mt-3 text-muted-foreground">
          ReturnGo&apos;s demo sign-in remembers one account per device. Register to create one.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/register">Create an account</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md px-4 py-14 text-center sm:px-6 sm:py-24 lg:px-8">
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">Sign in</span>
      {account ? (
        <>
          <h1 className="mt-3 font-display text-3xl font-semibold text-foreground">Welcome back, {account.name.split(" ")[0]}</h1>
          <p className="mt-3 text-muted-foreground">
            Signed in as a {ROLE_LABEL[account.role]} on this device.
          </p>
          <Button size="lg" className="mt-8" onClick={() => router.push(ROLE_DASHBOARD_PATH[account.role])}>
            <LogIn /> Continue to dashboard
          </Button>
        </>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">Checking this device…</p>
      )}
    </section>
  );
}
