import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { auth } from "@/auth";

// POST /api/upload — upload d'images et de vidéos
// Prod : Cloudinary si CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET sont définies
// Dev  : disque local dans uploads/ (servi par app/uploads/[name]/route.ts)
const HAS_CLOUDINARY = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  }
  const isImage = file.type.startsWith("image/");
  const isVideo = ["video/mp4", "video/webm", "video/quicktime"].includes(
    file.type
  );
  if (!isImage && !isVideo) {
    return NextResponse.json(
      { error: "Seules les images et vidéos (mp4, webm, mov) sont acceptées" },
      { status: 400 }
    );
  }
  const maxSize = isVideo ? 100 * 1024 * 1024 : 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json(
      { error: isVideo ? "Vidéo trop lourde (max 100 Mo)" : "Image trop lourde (max 5 Mo)" },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (HAS_CLOUDINARY) {
    const { v2: cloudinary } = await import("cloudinary");
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const result = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: "pozeidon", resource_type: "auto" },
            (err, res) => {
              if (err || !res)
                reject(err ?? new Error("Upload Cloudinary échoué"));
              else resolve(res as { secure_url: string });
            }
          )
          .end(buffer);
      }
    );
    return NextResponse.json({ path: result.secure_url });
  }

  // Fallback disque : dossier uploads/ servi par app/uploads/[name]/route.ts.
  // (public/ est figé au build en standalone — les fichiers écrits après
  // le démarrage n'y seraient jamais servis.)
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const safeName = `${crypto.randomUUID()}.${ext}`;
  const dir = process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, safeName), buffer);
  return NextResponse.json({ path: `/uploads/${safeName}` });
}
