import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

// Sert les fichiers uploadés via /api/upload depuis le dossier uploads/
// (public/ est figé au moment du build en mode standalone — les uploads
// runtime n'y sont jamais servis, d'où ce handler dédié)
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

  // D'abord uploads/, puis public/images en secours
  // (fichiers écrits là avant la migration /uploads)
  const candidates = [
    path.join(UPLOAD_DIR, file),
    path.join(process.cwd(), "public", "images", file),
  ];
  for (const filePath of candidates) {
    try {
      const data = await readFile(filePath);
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
