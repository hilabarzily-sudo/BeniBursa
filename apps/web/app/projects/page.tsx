import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function ProjectsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return (
      <main className="container py-12">
        <h1 className="text-2xl font-bold">הפרוייקטים שלי</h1>
        <p className="mt-4 text-muted-foreground">
          נדרשת התחברות. <Link href="/login" className="underline">התחבר</Link>
        </p>
      </main>
    );
  }

  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, description, created_at")
    .order("created_at", { ascending: false });

  return (
    <main className="container py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">הפרוייקטים שלי</h1>
        <Button asChild>
          <Link href="/projects/new">פרוייקט חדש</Link>
        </Button>
      </div>

      {!projects || projects.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            אין פרוייקטים עדיין. התחל את הראשון שלך.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <Link key={p.id} href={`/projects/${p.id}`}>
              <Card className="hover:border-primary/50 transition">
                <CardHeader>
                  <CardTitle>{p.name}</CardTitle>
                  <Badge variant="secondary" className="w-fit">
                    {new Date(p.created_at).toLocaleDateString("he-IL")}
                  </Badge>
                </CardHeader>
                {p.description && (
                  <CardContent className="text-sm text-muted-foreground">
                    {p.description}
                  </CardContent>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
