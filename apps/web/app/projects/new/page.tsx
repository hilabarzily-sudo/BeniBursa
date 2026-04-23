import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadZone } from "@/components/upload-zone";

export default function NewProjectPage() {
  return (
    <main className="min-h-screen">
      <div className="container max-w-3xl py-12">
        <h1 className="text-3xl font-bold">פרוייקט חדש</h1>
        <p className="mt-2 text-muted-foreground">
          העלה את החומרים שלך. תוכל להעלות וידאו, תמונות, ואודיו יחד.
        </p>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>החומרים שלך</CardTitle>
            <CardDescription>
              פורמטים נתמכים: MP4, MOV, JPG, PNG, MP3, WAV · עד 5GB לקובץ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UploadZone />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
