import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id, name, description, created_at")
    .eq("id", projectId)
    .single();
  if (!project) return notFound();

  const { data: assets } = await supabase
    .from("assets")
    .select("id, filename, type, status, duration_seconds, created_at")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  const { data: pieces } = await supabase
    .from("content_pieces")
    .select("id, type, platform, hook, status, thumbnail_url, output_url, predicted_performance_score")
    .eq("project_id", projectId)
    .order("predicted_performance_score", { ascending: false });

  return (
    <main className="container py-12">
      <h1 className="text-3xl font-bold">{project.name}</h1>
      {project.description && (
        <p className="mt-2 text-muted-foreground">{project.description}</p>
      )}

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">חומרים ({assets?.length ?? 0})</h2>
        <div className="grid gap-3">
          {assets?.map((a) => (
            <Card key={a.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium">{a.filename}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.type} · {a.duration_seconds ? `${Math.round(a.duration_seconds)}s` : ""}
                  </p>
                </div>
                <Badge
                  variant={
                    a.status === "analyzed"
                      ? "default"
                      : a.status === "failed"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {a.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">
          פיסות תוכן ({pieces?.length ?? 0})
        </h2>
        {!pieces || pieces.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              התוכן שלך מתהווה. נחזור אליך כשיהיו pieces מוכנות.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pieces.map((p) => (
              <Card key={p.id}>
                {p.thumbnail_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.thumbnail_url}
                    alt={p.hook ?? ""}
                    className="aspect-[9/16] w-full object-cover rounded-t-xl"
                  />
                )}
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{p.type}</Badge>
                    <Badge variant="secondary">{p.platform}</Badge>
                    <Badge>{p.predicted_performance_score?.toFixed(0)}</Badge>
                  </div>
                  <CardTitle className="text-base line-clamp-2">{p.hook}</CardTitle>
                </CardHeader>
                {p.output_url && (
                  <CardContent>
                    <a
                      href={p.output_url}
                      className="text-sm underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      הורד
                    </a>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
