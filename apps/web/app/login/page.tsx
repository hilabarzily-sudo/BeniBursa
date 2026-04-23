"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/projects` },
    });
    if (error) setError(error.message);
    else setSent(true);
  };

  return (
    <main className="container max-w-md py-24">
      <Card>
        <CardHeader>
          <CardTitle>התחבר</CardTitle>
          <CardDescription>נשלח לך קישור בכתובת המייל</CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <p className="text-sm text-muted-foreground">
              בדוק את המייל — שלחנו לך קישור כניסה.
            </p>
          ) : (
            <form onSubmit={sendMagicLink} className="space-y-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full">
                שלח קישור
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
