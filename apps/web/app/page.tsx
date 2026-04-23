import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Upload, Wand2, Download } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Sparkles className="h-5 w-5" />
            BeniBursa
          </Link>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/projects">הפרוייקטים שלי</Link>
            </Button>
            <Button asChild>
              <Link href="/projects/new">פרוייקט חדש</Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="container py-24 text-center">
        <Badge variant="secondary" className="mb-6">
          Social Content Engine · Beta
        </Badge>
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          מהחומר הגולמי שלך<br />ל-30+ פיסות תוכן בקליק אחד
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          העלה וידאו ארוך, פודקאסט או גלריית תמונות — המערכת מנתחת, מתכננת ומייצרת פוסטים
          מותאמים לכל פלטפורמה, לפי הדקדוק שלה.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/projects/new">התחל פרוייקט</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/how-it-works">איך זה עובד</Link>
          </Button>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid gap-6 md:grid-cols-4">
          <FeatureCard
            icon={<Upload className="h-6 w-6" />}
            title="1. העלאה"
            description="וידאו, תמונות, אודיו — עד 5GB לקובץ"
          />
          <FeatureCard
            icon={<Sparkles className="h-6 w-6" />}
            title="2. ניתוח עמוק"
            description="Scenes, transcript, mood, colors, faces — הכל אוטומטי"
          />
          <FeatureCard
            icon={<Wand2 className="h-6 w-6" />}
            title="3. תכנון וייצור"
            description="Reels, Carousels, Stories, Posts — לפי ה-playbook של כל פלטפורמה"
          />
          <FeatureCard
            icon={<Download className="h-6 w-6" />}
            title="4. הורדה או פרסום"
            description="ZIP מסודר או פרסום ישיר דרך Buffer"
          />
        </div>
      </section>

      <footer className="border-t mt-24">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          BeniBursa · Social Content Engine · Built with Claude
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
