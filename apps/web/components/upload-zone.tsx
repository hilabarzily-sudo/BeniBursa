"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, FileVideo, FileImage, FileAudio, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn, formatBytes } from "@/lib/utils";

type UploadItem = {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "completed" | "failed";
  assetId?: string;
  error?: string;
};

const ACCEPTED = "video/*,image/*,audio/*";
const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5GB

export function UploadZone() {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((files: FileList | File[]) => {
    const newItems: UploadItem[] = Array.from(files)
      .filter((f) => f.size <= MAX_FILE_SIZE)
      .map((file) => ({
        id: crypto.randomUUID(),
        file,
        progress: 0,
        status: "pending" as const,
      }));
    setItems((prev) => [...prev, ...newItems]);
  }, []);

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const startUpload = async () => {
    for (const item of items.filter((i) => i.status === "pending")) {
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: "uploading" } : i)),
      );

      try {
        const response = await fetch("/api/uploads/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: item.file.name,
            sizeBytes: item.file.size,
            contentType: item.file.type,
          }),
        });
        if (!response.ok) throw new Error(await response.text());
        const { uploadUrl, assetId } = await response.json();

        const xhr = new XMLHttpRequest();
        await new Promise<void>((resolve, reject) => {
          xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
              const pct = Math.round((e.loaded / e.total) * 100);
              setItems((prev) =>
                prev.map((i) => (i.id === item.id ? { ...i, progress: pct } : i)),
              );
            }
          });
          xhr.addEventListener("load", () =>
            xhr.status >= 200 && xhr.status < 300
              ? resolve()
              : reject(new Error(`Upload failed: ${xhr.status}`)),
          );
          xhr.addEventListener("error", () => reject(new Error("Network error")));
          xhr.open("PUT", uploadUrl);
          xhr.setRequestHeader("Content-Type", item.file.type);
          xhr.send(item.file);
        });

        await fetch(`/api/uploads/${assetId}/complete`, { method: "POST" });

        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? { ...i, status: "completed", progress: 100, assetId }
              : i,
          ),
        );
      } catch (err) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? { ...i, status: "failed", error: (err as Error).message }
              : i,
          ),
        );
      }
    }
  };

  const hasPending = items.some((i) => i.status === "pending");
  const totalSize = items.reduce((sum, i) => sum + i.file.size, 0);

  return (
    <div className="space-y-4">
      <label
        htmlFor="file-upload"
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center transition cursor-pointer",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50",
        )}
      >
        <Upload className="h-10 w-10 text-muted-foreground" />
        <p className="mt-3 font-medium">גרור קבצים לכאן או לחץ לבחירה</p>
        <p className="mt-1 text-sm text-muted-foreground">
          וידאו, תמונות, אודיו · עד 5GB לקובץ
        </p>
        <input
          id="file-upload"
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED}
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </label>

      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item) => (
            <UploadItemRow key={item.id} item={item} onRemove={() => removeItem(item.id)} />
          ))}
        </div>
      )}

      {items.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {items.length} קבצים · {formatBytes(totalSize)}
          </div>
          <Button onClick={startUpload} disabled={!hasPending} size="lg">
            {hasPending ? "התחל העלאה" : "הכל הועלה"}
          </Button>
        </div>
      )}
    </div>
  );
}

function UploadItemRow({ item, onRemove }: { item: UploadItem; onRemove: () => void }) {
  const Icon = item.file.type.startsWith("video")
    ? FileVideo
    : item.file.type.startsWith("audio")
      ? FileAudio
      : FileImage;

  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <Icon className="h-8 w-8 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium truncate">{item.file.name}</p>
          <span className="text-xs text-muted-foreground shrink-0">
            {formatBytes(item.file.size)}
          </span>
        </div>
        {item.status === "uploading" && (
          <div className="mt-2 flex items-center gap-2">
            <Progress value={item.progress} className="flex-1" />
            <span className="text-xs tabular-nums">{item.progress}%</span>
          </div>
        )}
        {item.status === "failed" && (
          <p className="mt-1 text-xs text-destructive">{item.error}</p>
        )}
        {item.status === "completed" && (
          <p className="mt-1 text-xs text-green-600">הועלה בהצלחה</p>
        )}
      </div>
      {item.status === "pending" ? (
        <Button variant="ghost" size="icon" onClick={onRemove}>
          <X className="h-4 w-4" />
        </Button>
      ) : item.status === "uploading" ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : null}
    </div>
  );
}
