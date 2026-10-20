import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";

// Sert les fichiers uploadés via /api/upload.
// Source principale : table `files` en base (persiste sans volume Docker).
// Secours : disque uploads/ puis public/images (fichiers écrits avant la
// migration en base, ou stockés là manuellement).
const UPLOAD_DIR = process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads");

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  avif: "image/avif",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
};

interface Props {
  params: Promise<{ name: string }>;
}

export async function GET(_req: Request, { params }: Props) {
  const { name } = await params;

  // Anti-traversal : nom de fichier simple, sans séparateur ni ".."
  const file = path.basename(decodeURIComponent(name));
  if (file !== name || file.startsWith(".") || file.includes("..")) {
    return new NextResponse("Not found", { status: 404 });
  }

  // Source principale : table files (uploads stockés en base64)
  try {
    const rows = await db
      .select({ mime: files.mime, data: files.data })
      .from(files)
      .where(eq(files.id, file))
      .limit(1);
    const row = rows[0];
    if (row) {
      return new NextResponse(Buffer.from(row.data, "base64"), {
        headers: {
          "Content-Type": row.mime,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }
  } catch {
    // table absente ou DB indisponible — on tente le disque
  }

  // Secours : uploads/ sur disque, puis public/images
  // (fichiers écrits là avant la migration /uploads)
  const candidates = [
    path.join(UPLOAD_DIR, file),
    path.join(process.cwd(), "public", "images", file),
  ];
  for (const filePath of candidates) {
    try {
      const data = await readFile(
        /* turbopackIgnore: true */ filePath
      );
      const ext = file.split(".").pop()?.toLowerCase() ?? "";
      return new NextResponse(new Uint8Array(data), {
        headers: {
          "Content-Type": MIME[ext] ?? "application/octet-stream",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      // fichier absent ici — on tente le suivant
    }
  }
  return new NextResponse("Not found", { status: 404 });
}
